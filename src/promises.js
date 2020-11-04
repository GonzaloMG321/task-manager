const add = (a, b) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(a + b);
    }, 1000);
  });
};

//add(1, 2).then((result) => console.log(result));

add(2, 2)
  .then((sum) => {
    console.log(sum);
    return add(sum, sum);
  })
  .then((sum) => console.log(sum))
  .catch((error) => console.log(error));
