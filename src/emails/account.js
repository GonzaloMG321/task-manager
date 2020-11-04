import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SG_APITOKEN);

const sendEmail = (email, name) => {
  const message = {
    to: email,
    from: "gonzalo.mendoza.itp@gmail.com",
    subject: `Welcome ${name}`,
    text: `Welcome to my web ${name}`,
    html: "<strong>Thansk for you subscription</strong>",
  };
  sgMail
    .send(message)
    .then(() => {
      console.log("Correo enviado");
    })
    .catch((error) => {
      console.log(error);
    });
};

export const sendCancelationMail = (email, name) => {
  const message = {
    to: email,
    from: "gonzalo.mendoza.itp@gmail.com",
    subject: `Canceling account`,
    text: `Goodbye ${name}`,
    html: "<strong>Tell me if you have a problem</strong>",
  };
  sgMail
    .send(message)
    .then(() => {
      console.log("Correo enviado");
    })
    .catch((error) => {
      console.log(error);
    });
};

export default sendEmail;
