/**
 * Exemplos de como usar o sistema de assinaturas
 *
 * Este arquivo contém exemplos práticos de como implementar
 * o sistema de assinaturas em componentes React
 */

import {
  cancelSubscription,
  createSubscription,
} from "@/actions/subscriptions";
import prisma from "@/lib/prisma";
import { createOrUpdateCourseSubscriptionPrices } from "@/lib/stripe-subscriptions";

// ================================
// EXEMPLO 1: Configurar preços de assinatura para um curso
// ================================

export async function setupCourseSubscriptionPricing(courseId: string) {
  try {
    const result = await createOrUpdateCourseSubscriptionPrices({
      courseId,
      title: "Curso de React Avançado",
      description: "Aprenda React do zero ao avançado",
      monthlyPrice: 29.99, // R$ 29,99 por mês
      semesterlyPrice: 149.99, // R$ 149,99 por semestre (6 meses) - 17% de desconto
      yearlyPrice: 249.99, // R$ 249,99 por ano - 30% de desconto
      currency: "MZN",
    });

    console.log("Preços configurados:", result);
    return result;
  } catch (error) {
    console.error("Erro ao configurar preços:", error);
    throw error;
  }
}

// ================================
// EXEMPLO 2: Criar uma assinatura
// ================================

export async function subscribeToCourse(
  courseId: string,
  interval: "monthly" | "semesterly" | "yearly"
) {
  try {
    const result = await createSubscription({
      courseId,
      interval,
    });

    if (result.success) {
      // Redirecionar para o Stripe Checkout
      // ou usar o clientSecret para configurar o Stripe Elements
      console.log("Assinatura criada:", result.data);
      return result.data;
    } else {
      console.error("Erro ao criar assinatura:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Erro ao criar assinatura:", error);
    throw error;
  }
}

// ================================
// EXEMPLO 3: Cancelar uma assinatura
// ================================

export async function cancelCourseSubscription(subscriptionId: string) {
  try {
    const result = await cancelSubscription({
      subscriptionId,
    });

    if (result.success) {
      console.log("Assinatura cancelada:", result.data);
      return result.data;
    } else {
      console.error("Erro ao cancelar assinatura:", result.error);
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Erro ao cancelar assinatura:", error);
    throw error;
  }
}

// ================================
// EXEMPLO 4: Buscar planos de assinatura disponíveis
// ================================

export async function getAvailableSubscriptionPlans() {
  try {
    // Buscar cursos disponíveis para assinatura
    const result = await prisma.course.findMany({
      where: {
        isPremium: true,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        price: true,
        currency: true,
      },
    });

    console.log("Cursos disponíveis para assinatura:", result);
    return result;
  } catch (error) {
    console.error("Erro ao buscar planos:", error);
    throw error;
  }
}

// ================================
// EXEMPLO 5: Componente React para exibir planos
// ================================

/*
import React from 'react';
import { getAvailableSubscriptionPlans } from '@/lib/subscription-examples';

export function SubscriptionPlansComponent() {
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPlans() {
      try {
        const plansData = await getAvailableSubscriptionPlans();
        setPlans(plansData);
      } catch (error) {
        console.error('Erro ao carregar planos:', error);
      } finally {
        setLoading(false);
      }
    }

    loadPlans();
  }, []);

  if (loading) return <div>Carregando planos...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {plans.map((course) => (
        <div key={course.id} className="border rounded-lg p-6">
          <h3 className="text-xl font-bold">{course.title}</h3>
          <p className="text-gray-600 mb-4">{course.description}</p>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Mensal:</span>
              <span className="font-bold">R$ {course.monthlyPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Semestral:</span>
              <span className="font-bold">
                R$ {course.semesterlyPrice}
                {course.discounts.semesterly > 0 && (
                  <span className="text-green-600 ml-2">
                    ({course.discounts.semesterly}% desconto)
                  </span>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Anual:</span>
              <span className="font-bold">
                R$ {course.yearlyPrice}
                {course.discounts.yearly > 0 && (
                  <span className="text-green-600 ml-2">
                    ({course.discounts.yearly}% desconto)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <button
              onClick={() => subscribeToCourse(course.id, 'monthly')}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Assinar Mensal
            </button>
            <button
              onClick={() => subscribeToCourse(course.id, 'semesterly')}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Assinar Semestral
            </button>
            <button
              onClick={() => subscribeToCourse(course.id, 'yearly')}
              className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
            >
              Assinar Anual
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
*/

// ================================
// EXEMPLO 6: Configuração do webhook no Stripe
// ================================

/*
Para configurar o webhook no Stripe:

1. Acesse o Dashboard do Stripe
2. Vá para "Developers" > "Webhooks"
3. Clique em "Add endpoint"
4. URL do endpoint: https://seudominio.com/api/webhooks/stripe
5. Eventos para escutar:
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
   - customer.subscription.trial_will_end

6. Copie o "Signing secret" e adicione como STRIPE_WEBHOOK_SECRET no .env
*/

// ================================
// EXEMPLO 7: Variáveis de ambiente necessárias
// ================================

/*
Adicione estas variáveis ao seu arquivo .env:

STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

Para produção, use as chaves live do Stripe:
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
*/
