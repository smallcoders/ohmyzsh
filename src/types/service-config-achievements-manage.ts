namespace AchievementsTypes {
  export type StringArray = [string];

  export type Achievements = {
    id: number;
    name: string;
    isTop: boolean;
    type: StringArray;
    keywordShow: StringArray;
    updateTime: string;
    state: string;
  };

  export type AchievementsDetail = {
    coverUrl: string;
    content: string;
    attachments: { id: string; name: string; path: string; format: string }[];
  } & Achievements;
}
export default AchievementsTypes;
