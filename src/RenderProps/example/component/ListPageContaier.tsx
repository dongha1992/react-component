import UpperLayout from "./UpperLayout";
import ArticleList from "./ArticleList";
import Hr from "./Hr";

interface Props {
  children: React.ReactElement[];
}

const ListPageContainer = ({ children }: Props) => {
  return <>{children}</>;
};

export default ListPageContainer;

// 아래에서 가져온 컴포넌트들을 묶어준다.
ListPageContainer.UpperLayout = UpperLayout; // 이 컴포넌트는 또 다른 Compound Component다
ListPageContainer.ArticleList = ArticleList;
ListPageContainer.Hr = Hr;
