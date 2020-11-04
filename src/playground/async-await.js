const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 2000);
  });
};

const doWork = async () => {
  const sum = await add(1, 1);
  const sum2 = await add(sum, sum);
  console.log("Esto apenas está ocurriendo");
  return sum2;
};

doWork()
  .then((result) => console.log(result))
  .catch((error) => console.log(error));

console.log("Esto ya ocurrió");
