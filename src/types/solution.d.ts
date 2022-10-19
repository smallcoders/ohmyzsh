namespace SolutionTypes {
  export type TreeNode = {
    name: string;
    children?: TreeNode[];
  };

  export type SolutionProvider = {
    id: number;
    name: string;
    aboutUs: string;
  };

  export type Solution = {
    id: number;
    isTop: boolean;
    name: string;
    types: TreeNode[];
    provider: SolutionProvider;
    areas: TreeNode[];
    publishTime: string;
    intentionCount: number;
    sort: number;
  };

  export type SolutionDetail = {
    coverUrl: string;
    content: string;
    attachments: { id: string; name: string; path: string; format: string }[];
  } & Solution;
}
export default SolutionTypes;
