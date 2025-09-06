"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Star, User } from "lucide-react";
import Image from "next/image";

interface Testimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  avatar?: string;
  rating: number;
  comment: string;
  course?: string;
  verified?: boolean;
}

interface CourseTestimonialsProps {
  testimonials?: Testimonial[];
  className?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    id: "1",
    name: "Maria Silva",
    role: "Desenvolvedora Java",
    company: "TechCorp",
    rating: 5,
    comment:
      "Excelente curso! O conteúdo é muito bem estruturado e os instrutores são extremamente didáticos. Consegui aplicar os conhecimentos imediatamente no meu trabalho.",
    verified: true,
  },
  {
    id: "2",
    name: "João Santos",
    role: "Engenheiro de Software",
    company: "StartupXYZ",
    rating: 5,
    comment:
      "O melhor curso de Java que já fiz. A qualidade do material e a profundidade dos conceitos são impressionantes. Recomendo para qualquer desenvolvedor.",
    verified: true,
  },
  {
    id: "3",
    name: "Ana Costa",
    role: "Desenvolvedora Full Stack",
    company: "Digital Solutions",
    rating: 5,
    comment:
      "Curso completo e atualizado. Os projetos práticos me ajudaram muito a consolidar o aprendizado. Vale cada centavo investido!",
    verified: true,
  },
  {
    id: "4",
    name: "Carlos Oliveira",
    role: "Tech Lead",
    company: "Innovation Labs",
    rating: 5,
    comment:
      "Material de altíssima qualidade. Os conceitos avançados são explicados de forma clara e prática. Meu time todo está fazendo este curso.",
    verified: true,
  },
  {
    id: "5",
    name: "Fernanda Lima",
    role: "Desenvolvedora Sênior",
    company: "Global Tech",
    rating: 5,
    comment:
      "Instrutores excepcionais e conteúdo sempre atualizado. A plataforma é muito intuitiva e o suporte é excelente. Superou minhas expectativas!",
    verified: true,
  },
  {
    id: "6",
    name: "Roberto Alves",
    role: "Arquiteto de Software",
    company: "Enterprise Solutions",
    rating: 5,
    comment:
      "Curso abrangente que cobre desde o básico até conceitos avançados. A metodologia de ensino é muito eficaz. Recomendo fortemente!",
    verified: true,
  },
];

export function CourseTestimonials({
  testimonials = defaultTestimonials,
  className,
}: CourseTestimonialsProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">O que nossos alunos dizem</h2>
          <p className="text-muted-foreground text-lg">
            Mais de 10.000 alunos já transformaram suas carreiras com nossos
            cursos
          </p>

          {/* Overall Rating */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 sm:h-6 sm:w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold">4.9</div>
              <div className="text-sm text-muted-foreground">
                Baseado em {testimonials.length * 150}+ avaliações
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6 space-y-4">
                  {/* Quote Icon */}
                  <div className="flex justify-start">
                    <Quote className="h-8 w-8 text-primary/20" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < testimonial.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-muted-foreground leading-relaxed line-clamp-4">
                    &quot;{testimonial.comment}&quot;
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-2">
                    <div className="relative">
                      {testimonial.avatar ? (
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                      {testimonial.verified && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">
                        {testimonial.name}
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {testimonial.role}
                        {testimonial.company && ` • ${testimonial.company}`}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center pt-8"
        >
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-8">
            <h3 className="text-2xl font-bold mb-4">
              Junte-se a milhares de alunos satisfeitos
            </h3>
            <p className="text-muted-foreground mb-6">
              Transforme sua carreira com nossos cursos de alta qualidade
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  10.000+
                </div>
                <div className="text-sm text-muted-foreground">
                  Alunos ativos
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  4.9/5
                </div>
                <div className="text-sm text-muted-foreground">
                  Avaliação média
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-primary">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">
                  Taxa de conclusão
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
