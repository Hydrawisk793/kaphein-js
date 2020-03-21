var ListQueue = require("../src").ListQueue;
var forOf = require("../src").forOf;

var q = new ListQueue([1, 2, 3]);
console.log("count : ", q.size);

while(!q.isEmpty()) {
    console.log(q.dequeue());
}
console.log("count : ", q.size);

q.enqueue(1).enqueue(2).enqueue(3).enqueue(4);
console.log("count : ", q.size);

console.log(q);
forOf(
    q,
    function (e)
    {
        console.log(e);
    }
);


console.log(q.entries());
forOf(
    q.entries(),
    function (e)
    {
        console.log(e);
    }
);

console.log(q.keys());
forOf(
    q.keys(),
    function (e)
    {
        console.log(e);
    }
);

console.log(q.values());
forOf(
    q.values(),
    function (e)
    {
        console.log(e);
    }
);
