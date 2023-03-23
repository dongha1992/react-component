import React from "react";

function ArticleList({ articles, renderListItem }: any) {
  return (
    <div>
      <>{articles.map((article: any) => renderListItem(article))}</>
    </div>
  );
}

export default ArticleList;
