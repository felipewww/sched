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

testes de fila:
-[x] 1 - validar o refreshTime para todas as opções (seconds, minutes, hours)

testes de job:

-[x] 1 - adicionar um job e aguardar entrar na fila
-[x] 2 - adicionar um job para 18:00 (horário bem mais tarde) e remove-lo
-[x] 3 - adicionar um job "em cima da hora" (dentro do timeout definido) e cancelar
-[ ] 4 - adicionar um job com erro (em cima da hora)
-[ ] 5 - adicionar um job com erro (para horário mais tarde)
-[x] 6 - adicionar um job vencido e tentar cancelar (??)

#####obs:
1- houve erro com a propriedade de avoidWatchNullCollection, comentado e removendo feature
para que essa feature funcione, precisa de um tratamento bem mais especifico:
- primeiro, deu bug por esta usando findNext(), deveria usar um count() para ssaber se existe pelo menos 1 registro
- se existir um registro, deverá validar a data, pois se esse 1 estiver agendado para daqui 1 ano, o timeout vai ficar rodando desnecesspario
- então, o correto seria pegar o proximo registro, ver sua data e agendar um timeout para um pouco antes.
- porem, esse timeout pode ficar perdido..
- melhor pensar com calma nessa logica... acima descrito apenas os problemas...

6- conforme o esperado, o job é executado e o cancel roda, porém sem ação, pois o job ja foi movido