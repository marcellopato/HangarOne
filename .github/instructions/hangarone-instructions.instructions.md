---
applyTo: '**'
---
Recebi uma informação importante de regras de negócios de Aeroclubes:
Cada aeroclube poder tar vários hangares, Aeroclubes tem pessoas, cada pessoa pode ter mais de uma aeronave, aeronave pode ficar em qquer hangar do mesmo areoclube
Piloto tem nome cpf endereco apelido data nasc, Piloto tem licenca letras e numeros, Aeronav tem prefixo lwtras numeros, Aeronav tem descricao tipo motor ano, Aeronav tem status operacao sim/nao

O sistema vai ser um SaaS multitenancy baseado em aeroclubes, ou seja, há um user que é o dono de um aeroclube, seus hangares, e os pilotes e suas aeronaves tem relação com o aeroclube. Teremos cargos de superadmin (com poder de total sobre todos os registros), admin (dono de aeroclube), manager(faz a gestão de um aeroclube), pilot(cliente de cada aeroclube e pode gerir suas aeronaves)