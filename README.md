Т.к. Next.js и FSD плохо совместимы, решение: 
1. Страница в widgets (src/widgets/main-page/(ui/lib/index.ts))
2. В src/app только импорт (app/main/ -> 
     export default function Page() {
         return <MainPage />;
   })

Вопрос: отдельная ли страница menu или при после анимации она встает поверх страницы

3. После верстки сделать ветки