"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface CourseFAQProps {
  faqs?: FAQItem[];
  className?: string;
}

const defaultFAQs: FAQItem[] = [
  {
    question: "Como funciona o acesso ao curso?",
    answer:
      "Após a assinatura, você terá acesso imediato a todo o conteúdo do curso. Pode estudar no seu próprio ritmo e acessar de qualquer dispositivo, a qualquer momento.",
  },
  {
    question: "Posso cancelar minha assinatura?",
    answer:
      "Sim! Você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento e você continuará tendo acesso até o final do período pago.",
  },
  {
    question: "Recebo certificado ao concluir o curso?",
    answer:
      "Sim! Ao concluir todas as aulas e atividades do curso, você receberá um certificado de conclusão que pode ser compartilhado no LinkedIn e em seu currículo.",
  },
  {
    question: "O conteúdo é atualizado?",
    answer:
      "Sim! O curso é atualizado regularmente com novos conteúdos, melhorias e as mais recentes práticas da indústria. Todas as atualizações são incluídas na sua assinatura.",
  },
  {
    question: "Posso fazer download dos materiais?",
    answer:
      "Dependendo do curso, alguns materiais podem estar disponíveis para download. Verifique as especificações do curso para mais detalhes sobre materiais disponíveis.",
  },
  {
    question: "Há suporte disponível?",
    answer:
      "Sim! Oferecemos suporte através da nossa comunidade de alunos e, para assinantes, suporte direto da nossa equipe de instrutores.",
  },
  {
    question: "Posso acessar o curso no celular?",
    answer:
      "Sim! Nossa plataforma é totalmente responsiva e funciona perfeitamente em dispositivos móveis, tablets e computadores.",
  },
  {
    question: "Há garantia de satisfação?",
    answer:
      "Oferecemos uma garantia de 30 dias. Se não ficar satisfeito com o curso, você pode solicitar o reembolso completo dentro deste período.",
  },
];

export function CourseFAQ({ faqs = defaultFAQs, className }: CourseFAQProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
            <HelpCircle className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-bold">
              Perguntas Frequentes
            </h2>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Tire suas dúvidas sobre o curso e nossa plataforma
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem
                value={`faq-${index}`}
                className="border rounded-lg px-4 sm:px-6 py-3 sm:py-4 bg-card/50 hover:bg-card/80 transition-colors"
              >
                <AccordionTrigger className="hover:no-underline text-left">
                  <div className="font-semibold text-base sm:text-lg">
                    {faq.question}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-3 sm:pt-4">
                  <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center pt-6"
        >
          <p className="text-muted-foreground">
            Ainda tem dúvidas?{" "}
            <a
              href="mailto:suporte@kudondza.com"
              className="text-primary hover:underline font-medium"
            >
              Entre em contato conosco
            </a>
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
