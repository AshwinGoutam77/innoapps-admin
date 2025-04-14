import { KanbanProvider } from '@/context/useKanbanContext';
import Board from './components/Board';
export const metadata = {
  title: 'Kanban'
};
const KanbanPage = () => {
  return <>
      <KanbanProvider>
        <Board />
      </KanbanProvider>
    </>;
};
export default KanbanPage;