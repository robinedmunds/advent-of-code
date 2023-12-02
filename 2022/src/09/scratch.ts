// check that a items are mutated. they are
const a = [{ v: 0 }, { v: 0 }, { v: 0 }]

const f = (a) => {
  for (let i = 0; i < a.length; ++i) {
    a[i].v = i * 10
  }
}

f([...a])
console.log(a)

