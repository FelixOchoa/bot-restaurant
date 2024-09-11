let listNumbers = [];
const OPTIONS_START = ["1", "2", "3"];
const MENU = `
🍔 **Menú de Comidas Rápidas** 🍔
1. Hamburguesa - $5.00
2. Papas Fritas - $2.50
3. Perro Caliente - $4.00
4. Nuggets de Pollo - $3.50
5. Refresco - $1.50
6. Batido de Frutas - $2.00
`;

export function start(client, orders) {
  client.onMessage(async (message) => {
    let getNumber = listNumbers.find(
      (number) => number.number === message.from
    );

    if (!getNumber && message.body !== "") {
      getNumber = {
        id: listNumbers.length + 1,
        number: message.from,
        name: message.sender?.name || "Cliente",
        step: "start",
        attempt: 0,
      };
      listNumbers.push(getNumber);

      await client.sendText(
        message.from,
        `¡Hola! Bienvenido ${getNumber.name} a Restaurante de Felix 🤲🏼\nEnvíanos un mensaje con la opción que necesites: \n\n1️⃣ Hacer un Pedido 🍔\n2️⃣ Consultar el menú 📑\n`
      );
      return;
    }

    if (!getNumber) {
      return;
    }

    if (getNumber.step === "start" && !OPTIONS_START.includes(message.body)) {
      if (getNumber.attempt === 0) {
        getNumber.attempt = 1;
        return;
      }

      await client.sendText(
        message.from,
        `Recuerda que solo tenemos estas opciones: \n\n1️⃣ Hacer un Pedido 🍔\n2️⃣ Consultar el menú 📑\n`
      );

      getNumber.attempt++;

      if (getNumber.attempt >= 5) {
        await client.sendText(
          message.from,
          `Lo siento ${getNumber.name}, no entendimos lo que quisiste decir, en 5 minutos puedes pedirlo de nuevo.`
        );
        listNumbers = listNumbers.filter(
          (number) => number.number !== getNumber.number
        );
      }
      return;
    }

    if (message.body === "1" && getNumber.step === "start") {
      getNumber.step = "order";
      await client.sendText(
        message.from,
        "Escribe el pedido separado por comas (,), ejemplo: hamburguesa, papas fritas, ensalada ✋🏽"
      );
      return;
    }

    if (message.body === "2" && getNumber.step === "start") {
      await client.sendText(message.from, MENU);
      await client.sendText(
        message.from,
        `Envíanos un mensaje con la opción que necesites: \n\n1️⃣ Hacer un Pedido 🍔\n2️⃣ Consultar el menú 📑\n`
      );
      return;
    }

    if (getNumber.step === "order") {
      getNumber.order = message.body;
      await client.sendText(
        message.from,
        "Escribe tu nombre para asignar al pedido 📝"
      );
      getNumber.step = "order.name";
      return;
    }

    if (getNumber.step === "order.name") {
      getNumber.nameOrder = message.body;
      await client.sendText(
        message.from,
        "Escribe tu celular para llamarte cuando esté listo el pedido 📞"
      );
      getNumber.step = "order.phone";
      return;
    }

    if (getNumber.step === "order.phone") {
      getNumber.phone = message.body;
      await client.sendText(
        message.from,
        "Escribe tu dirección para enviar el pedido 📨"
      );
      getNumber.step = "order.address";
      return;
    }

    if (getNumber.step === "order.address") {
      getNumber.address = message.body;
      await client.sendText(
        message.from,
        `La información de tu pedido es: 📝\nOrden: ${getNumber.order}\nNombre: ${getNumber.nameOrder}\nDirección: ${getNumber.address}\nTeléfono: ${getNumber.phone}`
      );

      await client.sendText(
        message.from,
        "Muchas gracias por tu pedido 🥳. En breve te llamaremos para avisarte de la entrega del pedido."
      );

      orders.push(getNumber);

      listNumbers = listNumbers.filter(
        (number) => number.number !== getNumber.number
      );
    }
  });
}
