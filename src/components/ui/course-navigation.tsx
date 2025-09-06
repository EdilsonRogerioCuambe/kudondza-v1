"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Bookmark, Heart, Share2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface CourseNavigationProps {
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    originalPrice?: number;
  };
  isEnrolled?: boolean;
  isCompleted?: boolean;
}

export function CourseNavigation({
  course,
  isEnrolled,
  isCompleted,
}: CourseNavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [200, 300], [0, 1]);
  const y = useTransform(scrollY, [200, 300], [20, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const hasDiscount =
    course.originalPrice && course.originalPrice > course.price;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((course.originalPrice! - course.price) / course.originalPrice!) * 100
      )
    : 0;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: course.title,
          text: `Confira este curso incrível: ${course.title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.log("Error sharing:", error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  if (!isVisible) return null;

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Course Info */}
          <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base lg:text-lg font-semibold truncate">
                {course.title}
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                {course.price === 0 ? (
                  <span className="text-green-600 font-medium">Gratuito</span>
                ) : (
                  <>
                    <span className="font-semibold">
                      {course.currency} {Number(course.price).toFixed(2)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="line-through text-muted-foreground hidden sm:inline">
                          {course.currency}{" "}
                          {Number(course.originalPrice).toFixed(2)}
                        </span>
                        <span className="text-red-500 font-medium">
                          -{discountPercentage}%
                        </span>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLiked(!isLiked)}
              className={`transition-colors ${
                isLiked ? "text-red-500 border-red-500" : ""
              }`}
            >
              <Heart
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  isLiked ? "fill-current" : ""
                }`}
              />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`transition-colors ${
                isBookmarked ? "text-yellow-500 border-yellow-500" : ""
              }`}
            >
              <Bookmark
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  isBookmarked ? "fill-current" : ""
                }`}
              />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="hidden sm:flex"
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <div className="w-px h-4 sm:h-6 bg-border mx-1 sm:mx-2" />

            {/* Main CTA Button */}
            <Button
              size="sm"
              className="font-semibold text-xs sm:text-sm px-2 sm:px-4"
              asChild
            >
              <Link
                href={
                  isCompleted
                    ? `/courses/${course.slug}/certificate`
                    : isEnrolled
                    ? `/courses/${course.slug}/learn`
                    : `/courses/${course.slug}/payment`
                }
              >
                {isCompleted ? (
                  <>
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Ver certificado</span>
                    <span className="sm:hidden">Certificado</span>
                  </>
                ) : isEnrolled ? (
                  <>
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Continuar curso</span>
                    <span className="sm:hidden">Continuar</span>
                  </>
                ) : course.price === 0 ? (
                  <>
                    <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Começar agora</span>
                    <span className="sm:hidden">Começar</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Assinar curso</span>
                    <span className="sm:hidden">Assinar</span>
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
