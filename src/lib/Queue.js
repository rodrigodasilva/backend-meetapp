import Bee from 'bee-queue';
import SubscriptionMail from '../app/jobs/SubscriptionMail';
import redisConfig from '../config/redis';

const jobs = [SubscriptionMail];

class Queue {
  constructor() {
    this.queues = [];

    this.init();
  }

  /**
   * Percorre os jobs, acessando o key e o handle de cada job
   * armazenando em 'this.queues' a fila em 'bee', com uma instancia do redis
   * e o 'handle', que é o método responsavel por processar o job
   */
  init() {
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        bee: new Bee(key, {
          redis: redisConfig,
        }),
        handle,
      };
    });
  }

  /**
   * Método responsável por adicionar novos trabalhos à fila
   * Ex: sempre que um novo email for disparado, ele adiciona
   * esse novo job dentro da fila para ele ser processado
   */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * Método responsável por processar as filas
   */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.on('failed', this.handleFailure).process(handle);
    });
  }

  /**
   * Método responsável por processar os erros
   */
  handleFailure(job, err) {
    console.log(`Queue ${job.queue.name}: FAILED`, err);
  }
}

export default new Queue();
