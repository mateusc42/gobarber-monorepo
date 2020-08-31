# Recuperaçao de senha

**RF**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário devo receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios em ambiente de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano(background job);


**RN**

- O link enviado por e-mail deve expirar em duas horas;
- O usuário precisa confirmar a nova senha ao resetar a antiga;


# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, email, senha;

**RNF**

-


**RN**

- O usuário não pode alterar seu e-mail para um e-mail já utilizado(outro usuário);
- Para atualizar sua senha, o usuário deve informar sua senha antiga;
- Para atualizar sua senha, o usuário deve confirmar sua nova senha;


# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestados deve poder visualizar as notificações não lidas;


**RNF**

- Os agendamentos do prestador no dia devem ser armazenos em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io;


**RN**

- A notificação deve ter um status de lida ou não-lida para que o prestador possa controlar;

# Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder visualizar os dias de um mês com pelo menos um horário disponível de um prestador;
- O usuário deve poder listar os horários disponíveis em um dia específico de um prestador.
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;


**RN**

- Cada agendamento deve durar 1h exatamente;
- Os agendamentos devem estar disponíeis entre 8h às 18h(Primeiro às 8h, último Às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário que já passou;
- O usuário não pode agendar serviços consigo mesmo;



