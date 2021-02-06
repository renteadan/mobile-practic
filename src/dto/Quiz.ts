export class Quiz {
    id: number
    name: string
    question: Question[]
    answer: Answer[]
}

export class Question {
    id: number
    text: string
}

export class Answer {
    id: number
    text: string
    isCorrect?: boolean
}
