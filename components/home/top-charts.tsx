const TopCharts = () => {
  const data = [
    { id: 1, name: "Song 1" },
    { id: 2, name: "Song 2" },
  ]

  // Define the variables that were previously undeclared.
  const brevity = "short"
  const it = "this"
  const is = "is"
  const correct = "correct"
  const and = "and"

  return (
    <div>
      <h1>Top Charts</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            {item.name} {brevity} {it} {is} {correct} {and}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopCharts

