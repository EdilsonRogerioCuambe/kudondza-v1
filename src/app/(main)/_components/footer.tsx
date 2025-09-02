import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t bg-background">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <h3 className="font-semibold mb-3">Kudondza</h3>
          <p className="text-sm text-muted-foreground">
            Plataforma de aprendizagem e comunidade para developers em
            Moçambique.
          </p>
        </div>
        <div>
          <h4 className="font-medium mb-2">Plataforma</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/courses" className="hover:underline">
                Cursos
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:underline">
                Comunidade
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:underline">
                Sobre
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Recursos</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/docs" className="hover:underline">
                Documentação
              </Link>
            </li>
            <li>
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/support" className="hover:underline">
                Suporte
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium mb-2">Legal</h4>
          <ul className="space-y-1 text-sm">
            <li>
              <Link href="/privacy" className="hover:underline">
                Privacidade
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                Termos
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 py-6 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            © {new Date().getFullYear()} Kudondza. Todos os direitos reservados.
          </span>
          <span>Feito com ❤️ em Moçambique</span>
        </div>
      </div>
    </footer>
  );
}
