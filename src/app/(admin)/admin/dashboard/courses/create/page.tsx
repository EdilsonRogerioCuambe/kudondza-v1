import CreateCoursePage from "./_components/create-course-page";

export default async function Page() {

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Criar Novo Curso
          </h2>
          <p className="text-muted-foreground">
            Preencha as informações para criar um novo curso
          </p>
        </div>
      </div>

      <CreateCoursePage />
    </main>
  );
}
