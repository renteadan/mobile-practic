import axios from 'axios'
import { Plugins } from '@capacitor/core'
import { Answer, Quiz } from './dto/Quiz'
export default class Service {
    host = 'http://192.168.0.131:3000'
    instance = axios.create({
        baseURL: this.host,
    })

    storage = Plugins.Storage

    getTeamsWithWs() {
        const ws = new WebSocket('ws://localhost:3000')
        ws.onopen = (e) => {
            console.log('open socket')
            ws.send('mesajjj')
        }

        ws.onmessage = (event) => {
            alert(`[message] Data received from server: ${event.data}`)
        }
    }

    logout() {
        localStorage.removeItem('myToken')
    }

    async getName(): Promise<string> {
        const name = await this.storage.get({ key: 'name' })
        if (!name.value) {
            return ''
        }
        return name.value
    }

    async setName(name: string) {
        await this.storage.set({ key: 'name', value: name })
    }

    async login(name: string) {
        const response = await this.instance.post('/auth', { name })
        return response.data
    }

    async getQuizez(): Promise<Quiz[]> {
        const response = await this.instance.get('/quiz')
        return response.data
    }

    async startQuiz(name: string): Promise<Quiz> {
        const response = await this.instance.post('/quiz', { name })
        return response.data
    }

    async getQuiz(name: string): Promise<Quiz[]> {
        const response = await this.instance.get('/quiz', {
            params: {
                name,
            },
        })
        return response.data
    }

    async sendAnsers(answer: Answer[], quizId: number): Promise<void> {
        const response = await this.instance.patch(`/quiz/${quizId}`, {
            answer,
        })
    }
}
