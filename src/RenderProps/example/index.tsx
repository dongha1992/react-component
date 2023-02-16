import React from "react";
import ListPageContainer from "./component/ListPageContaier";

const Article = ({ article }: any) => {
  return <div>{article.name}</div>;
};

function RenderPropsAndCompound() {
  const articles: any = [
    { name: "name1" },
    { name: "name2" },
    { name: "name2" },
  ];
  const tags: any = [{ name: `tag1` }, { name: `tag2` }, { name: `tag3` }];

  return (
    <div>
      <ListPageContainer>
        <ListPageContainer.UpperLayout>
          <ListPageContainer.UpperLayout.Hero
            text="Programming"
            listLength={articles.length}
          />
          <ListPageContainer.UpperLayout.TagSearch tags={tags} />
        </ListPageContainer.UpperLayout>
        <ListPageContainer.Hr />
        <ListPageContainer.ArticleList
          articles={articles}
          renderListItem={(article: any) => (
            <Article article={article} key={article.name} />
          )}
        />
      </ListPageContainer>
    </div>
  );
}

export default RenderPropsAndCompound;
