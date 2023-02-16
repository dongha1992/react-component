import React from "react";

const Hero = (props: any) => {
  return <div></div>;
};
const TagSearch = (props: any) => {
  return <div></div>;
};

interface Props {
  children: React.ReactElement[];
}

function UpperLayout({ children }: Props) {
  return <div>{children}</div>;
}

export default UpperLayout;

UpperLayout.Hero = Hero;
UpperLayout.TagSearch = TagSearch;
