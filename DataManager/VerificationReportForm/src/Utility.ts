import * as DataManager from "../DataManager";


export class Utility {
    public static toDifficulty(difficultyText: string): DataManager.Difficulty {
        let comparisonText = difficultyText ? difficultyText.toUpperCase() : "";
        switch (comparisonText) {
            case "BASIC":
                return DataManager.Difficulty.Basic;
            case "ADVANCED":
                return DataManager.Difficulty.Advanced;
            case "EXPERT":
                return DataManager.Difficulty.Expert;
            case "MASTER":
                return DataManager.Difficulty.Master;
        }
        throw new Error(`[Utility.toDifficulty]unkown difficulty. difficultyText="${difficultyText}"`);
    }

    public static toDifficultyText(difficulty: DataManager.Difficulty): string {
        switch (difficulty) {
            case DataManager.Difficulty.Basic:
                return "BASIC";
            case DataManager.Difficulty.Advanced:
                return "ADVANCED";
            case DataManager.Difficulty.Expert:
                return "EXPERT";
            case DataManager.Difficulty.Master:
                return "MASTER";
        }
        throw new Error(`[Utility.toDifficultyText]unkown difficulty. difficulty=${difficulty}`);
    }

    public static toDifficultyTextLowerCase(difficulty: DataManager.Difficulty): string {
        return this.toDifficultyText(difficulty).toLowerCase();
    }

    public static getDifficultyImagePath(difficulty: string): string {
        switch (difficulty.toUpperCase()) {
            case "BASIC":
                return "https://drive.google.com/uc?id=1HhL8aJGebqohVn6FMA6aFaCyiOnUlb2Z";
            case "ADVANCED":
                return "https://drive.google.com/uc?id=1WqF0ywk8zqLrylDy2006YaH7yAiYAp5E";
            case "EXPERT":
                return "https://drive.google.com/uc?id=1h6H7fLsJaMytSXrQmDjfXkd7U8af782-";
            case "MASTER":
                return "https://drive.google.com/uc?id=14O1fUFBT7l83gY8BvTN3DVKx3gEJyr0U";
        }
    }
}