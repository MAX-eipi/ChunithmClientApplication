export enum Difficulty {
    Invalid,
    Basic,
    Advanced,
    Expert,
    Master,
    WorldsEnd
}

export enum Genre {
    Invalid,
    POPS_AND_ANIME,
    niconico,
    東方Project,
    VARIETY,
    イロドリミドリ,
    言ノ葉Project,
    ORIGINAL,
    All,
}

export function toGenreText(genre: Genre): string {
    switch (genre) {
        case Genre.POPS_AND_ANIME:
            return "POPS & ANIME";
        case Genre.niconico:
            return "niconico";
        case Genre.東方Project:
            return "東方Project";
        case Genre.VARIETY:
            return "VARIETY";
        case Genre.イロドリミドリ:
            return "イロドリミドリ";
        case Genre.言ノ葉Project:
            return "言ノ葉Project";
        case Genre.ORIGINAL:
            return "ORIGINAL";
    }
    return "";
}

export function toGenre(genreText: string): Genre {
    switch (genreText) {
        case "POPS & ANIME":
            return Genre.POPS_AND_ANIME;
        case "niconico":
            return Genre.niconico;
        case "東方Project":
            return Genre.東方Project;
        case "VARIETY":
            return Genre.VARIETY;
        case "イロドリミドリ":
            return Genre.イロドリミドリ;
        case "言ノ葉Project":
            return Genre.言ノ葉Project;
        case "ORIGINAL":
            return Genre.ORIGINAL;
    }
    return Genre.Invalid;
}