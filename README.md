#### TODO List

* Auth e segurança
-[ ] criar token de autenticação na api
-[ ] autenticar admin/publisher no monolito no login
-[ ] validar token via middleware

* Multi tenant
-[ ] Criar config de tenant para conexões de banco diferente

*
-[ ] Agendar um tarefa data especifica
-[ ] Agendar duas tarefas na mesma data e deletar uma
-[ ] Não permitir agendar tarefa para mais de 1 ano (por causa do cron, não da pra saber o ano)
-[ ] e os logs do beedoo na model?
-[ ] agendar para portgual

processo

- mongo
    - queues
        - (ex:) WikiStatus
        - (ex:) QuizStatus

Queue é uma classe que trata especificamente cada item de sua fila

- Objeto: Task
umas task sempre é inserida em uma queue e deve seguir padrões de objeto
```
{
    _id: unique,
    data: DataContract
    schedule: {
        team: number, // team id
        by: number, //user id
        at: Date
        to: Date
    }
    scheduledAt: Date
    scheduledTo: Date
}
```

```
interface DataContract {
    teamId: number,
    userId: number,
    args: number,
}
```

status
1 = 