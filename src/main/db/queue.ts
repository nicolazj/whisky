import { ipcMain } from 'electron'
import { TransTask } from '../../shared/api.types'
import log from '../logger'
import { CRUD, crud } from './crud'
import { processor } from '../processor'
import { wm } from '../window'

const logger = log.scope('queue')

export class Queue {
  private isRunning = false
  constructor(private crud: CRUD) {}

  public init() {
    this.registerIpcHandlers()
    this.resetTasks()
    this.runTask()
  }

  private async addTask(task: TransTask) {
    await this.crud.addTask(task)
    this.runTask()
  }
  private async reTransById(id){
    await this.crud.updateTask(id,'init')
    this.runTask()
  }

  private resetTasks() {
    this.crud.resetTasks()
  }

  private async runTask() {
    let self = this
    async function worker() {
      while (true) {
        const task = await self.crud.pickTask()
        if (!task) {
          return
        }

        await self.crud.updateTask(task.id, 'processing')

        try {
          await processor(task, (progress) => {
            wm.win?.webContents.send(`transcribe-progress-${task.id}`, progress)
          })

          await self.crud.updateTask(task.id, 'done')
          wm.getWin()?.webContents.send('query-client-revalidate', ['tasks'])

        } catch (e) {
          logger.error('transcribe failed', e)
          await self.crud.updateTask(task.id, 'failed')
        }
      }
    }

    if (this.isRunning) return
    this.isRunning = true
    await Promise.all(new Array(1).fill(0).map(worker))
    this.isRunning = false
  }

  private registerIpcHandlers() {
    ipcMain.handle('add-task', async (event, task: TransTask) => {
      await this.addTask(task)
      event.sender.send('query-client-revalidate', ['tasks'])
    })
    ipcMain.handle('re-trans-by-id', async (event, id: string) => {
      await this.reTransById(id)
      event.sender.send('query-client-revalidate', ['tasks'])
    })

  }
}

export const queue = new Queue(crud)
