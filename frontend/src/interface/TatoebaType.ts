export interface TatoebaType {
    data: Data;
}

export interface Data {
    paging:  Paging;
    results: Result[];
}

export interface Paging {
    Sentences: Sentences;
}

export interface Sentences {
    finder:           string;
    page:             number;
    current:          number;
    count:            number;
    perPage:          number;
    start:            number;
    end:              number;
    prevPage:         boolean;
    nextPage:         boolean;
    pageCount:        number;
    sort:             string;
    direction:        boolean;
    limit:            null;
    sortDefault:      boolean;
    directionDefault: boolean;
    scope:            null;
    completeSort:     any[];
}

export interface Result {
    id:                       number;
    text:                     string;
    lang:                     string;
    correctness:              number;
    script:                   null;
    license:                  License;
    translations:             Array<Translation[]>;
    transcriptions?:          Transcription[];
    audios:                   Audio[];
    user:                     User;
    lang_name:                string;
    dir:                      string;
    lang_tag:                 string;
    is_favorite:              null;
    is_owned_by_current_user: boolean;
    permissions:              null;
    max_visible_translations: number;
    current_user_review:      null;
}

export interface Audio {
    id:              number;
    author:          Author;
    attribution_url: null;
    license:         null;
    external?:       null;
    sentence_id?:    number;
    user?:           User;
}

export interface Translation {
    id:             number;
    text:           string;
    lang:           string;
    correctness:    number;
    script:         null;
    transcriptions: any[];
    audios:         Audio[];
    isDirect?:      boolean;
    lang_name:      string;
    dir:            string;
    lang_tag:       string;
}

export interface Transcription {
    id:           number;
    sentence_id:  number;
    script:       string;
    text:         string;
    user_id:      number | null;
    needsReview:  boolean;
    modified:     Date;
    user:         User | null;
    readonly:     boolean;
    type:         string;
    html:         string;
    markup:       null;
    info_message: string;
}

export interface User {
    username: string;
}
