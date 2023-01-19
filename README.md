# Desafio DEV BACKEND BRGaming

Criação de uma API Rest para CRUD de restaurantes e seus respectivos horários de funcionamento.

Deve ser enviado a URL do swagger do sistema publicado em algum servidor e o link para o repositório.

Pode ser usado qualquer banco de dados relacional moderno (Oracle, SQLServer, MySQL, Postgre…)

## CRUD Restaurantes

CRUD básico como nome, documento, tipo (lanchonete, sorveteria, …) e etc

## CRUD Horarios

Deve-se planejar uma estrutura que permita definir horários de funcionamento diferentes para cada dia da semana, como no exemplo:

- Domingo: Fechado o dia todo
- Segunda: Aberto entre 12hrs e 22hrs
- Terça a quinta: Aberto entre 8hrs até 12hrs. E entre 14hrs até 20hrs
- Sexta e sabado: Aberto de 8hrs até 23hrs

## Endpoint “IsOpen”

Deve receber um `DateTime` como parâmetro e responder com true (está aberto) ou false (está fechado)

### TODO

[ ] Criar restaurante

- [ ] Sem horário de funcionamento
- [ ] Com horário de funcionamento

[ ] Criar horário
