/* eslint-disable @typescript-eslint/no-explicit-any */
import "server-only";

import { sendEmail } from "./email-service";

// Interface para itens da fila de email
interface EmailQueueItem {
  id: string;
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  priority: "high" | "normal" | "low";
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}

// Fila de emails em memória (para desenvolvimento)
// Em produção, use Redis ou uma fila dedicada como Bull/BullMQ
class EmailQueue {
  private queue: EmailQueueItem[] = [];
  private processing = false;
  private intervalId: NodeJS.Timeout | null = null;

  constructor() {
    // Iniciar processamento da fila
    this.startProcessing();
  }

  // Adicionar email à fila
  async addEmail(
    item: Omit<EmailQueueItem, "id" | "attempts" | "createdAt">
  ): Promise<string> {
    const emailItem: EmailQueueItem = {
      id: `email_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      attempts: 0,
      createdAt: new Date(),
      ...item,
    };

    // Adicionar à fila baseado na prioridade
    if (item.priority === "high") {
      this.queue.unshift(emailItem);
    } else {
      this.queue.push(emailItem);
    }

    console.log(
      `📧 Email adicionado à fila: ${emailItem.id} (Prioridade: ${item.priority})`
    );
    return emailItem.id;
  }

  // Iniciar processamento da fila
  private startProcessing() {
    if (this.intervalId) return;

    this.intervalId = setInterval(async () => {
      if (!this.processing && this.queue.length > 0) {
        await this.processQueue();
      }
    }, 5000); // Processar a cada 5 segundos

    console.log("📧 Processador de fila de emails iniciado");
  }

  // Parar processamento da fila
  stopProcessing() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("📧 Processador de fila de emails parado");
    }
  }

  // Processar fila de emails
  private async processQueue() {
    this.processing = true;

    try {
      const itemsToProcess = this.queue.filter((item) => {
        // Verificar se é hora de processar (para emails agendados)
        if (item.scheduledFor && item.scheduledFor > new Date()) {
          return false;
        }
        return item.attempts < item.maxAttempts;
      });

      if (itemsToProcess.length === 0) {
        return;
      }

      console.log(`📧 Processando ${itemsToProcess.length} emails da fila`);

      // Processar emails em lotes de 3 para não sobrecarregar
      const batchSize = 3;
      const batches = [];
      for (let i = 0; i < itemsToProcess.length; i += batchSize) {
        batches.push(itemsToProcess.slice(i, i + batchSize));
      }

      for (const batch of batches) {
        await Promise.allSettled(
          batch.map((item) => this.processEmailItem(item))
        );

        // Pequena pausa entre lotes
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error("❌ Erro ao processar fila de emails:", error);
    } finally {
      this.processing = false;
    }
  }

  // Processar item individual da fila
  private async processEmailItem(item: EmailQueueItem) {
    try {
      console.log(
        `📧 Processando email ${item.id} (tentativa ${item.attempts + 1}/${
          item.maxAttempts
        })`
      );

      const result = await sendEmail({
        to: item.to,
        subject: item.subject,
        html: item.html,
        from: item.from,
      });

      if (result.success) {
        // Remover da fila se enviado com sucesso
        this.removeFromQueue(item.id);
        console.log(`📧 ✅ Email ${item.id} enviado com sucesso`);
      } else {
        // Incrementar tentativas
        item.attempts++;

        if (item.attempts >= item.maxAttempts) {
          // Remover da fila se excedeu tentativas
          this.removeFromQueue(item.id);
          console.error(
            `📧 ❌ Email ${item.id} falhou após ${item.maxAttempts} tentativas`
          );
        } else {
          // Agendar nova tentativa com backoff exponencial
          const delay = Math.pow(2, item.attempts) * 60000; // Delay em minutos
          item.scheduledFor = new Date(Date.now() + delay);
          console.log(
            `📧 ⏳ Email ${
              item.id
            } reagendado para ${item.scheduledFor.toISOString()}`
          );
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar email ${item.id}:`, error);
      item.attempts++;

      if (item.attempts >= item.maxAttempts) {
        this.removeFromQueue(item.id);
      }
    }
  }

  // Remover item da fila
  private removeFromQueue(id: string) {
    const index = this.queue.findIndex((item) => item.id === id);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }

  // Obter estatísticas da fila
  getStats() {
    return {
      total: this.queue.length,
      high: this.queue.filter((item) => item.priority === "high").length,
      normal: this.queue.filter((item) => item.priority === "normal").length,
      low: this.queue.filter((item) => item.priority === "low").length,
      processing: this.processing,
    };
  }

  // Limpar fila (para desenvolvimento)
  clear() {
    this.queue = [];
    console.log("📧 Fila de emails limpa");
  }
}

// Instância singleton da fila
export const emailQueue = new EmailQueue();

// Função helper para adicionar email à fila
export async function queueEmail(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  priority?: "high" | "normal" | "low";
  maxAttempts?: number;
  scheduledFor?: Date;
  metadata?: Record<string, any>;
}): Promise<string> {
  return emailQueue.addEmail({
    to: options.to,
    subject: options.subject,
    html: options.html,
    from: options.from,
    priority: options.priority || "normal",
    maxAttempts: options.maxAttempts || 3,
    scheduledFor: options.scheduledFor,
    metadata: options.metadata,
  });
}

// Função para envio imediato (bypass da fila)
export async function sendEmailImmediate(options: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}) {
  return sendEmail(options);
}
