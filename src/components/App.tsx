import { useState } from "react"
import styles from "./App.module.css"

// Summary
// 1. Clicking on the upper left square runs the function that the button received as its onClick prop from the Square. The Square component received that function as its onSquareClick prop from the Board. The Board component defined that function directly in the JSX. It calls handleClick with an argument of 0.
// 2. handleClick uses the argument (0) to update the first element of the squares array from null to X.
// 3. The squares state of the Board component was updated, so the Board and all of its children re-render. This causes the value prop of the Square component with index 0 to change from null to X.

export default function Game() {
    // Each time a player moves, xIsNext (a boolean) will be flipped to determine
    // which player goes next and the game’s state will be saved.

    // Array(9).fill(null) creates an array with nine elements and sets each of them to null.
    // The useState() call around it declares a squares state variable that’s initially set to that array.
    // Each entry in the array corresponds to the value of a square.

    // DECLARE STATE VARIABLES
    // These require storage (can't be calculated) so use the
    // state to store the values, hence... useState!
    const [history, setHistory] = useState([Array(9).fill(null)])
    const [currentMove, setCurrentMove] = useState(0)

    // These parameters can be calculated from the available state
    // so don't need to be stored as state
    const currentSquares = history[currentMove]
    const xIsNext = currentMove % 2 === 0

    function handlePlay(nextSquares: (string | null)[]) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]
        setHistory(nextHistory)
        setCurrentMove(nextHistory.length - 1)
    }

    function resetGame() {
        // Reset the board state
        setCurrentMove(0)

        // Reset the history state
        setHistory([Array(9).fill(null)])
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>
                    <MoveHistory
                        history={history}
                        currentMove={currentMove}
                        setCurrentMove={setCurrentMove}
                    />
                </ol>
            </div>
            <button
                className={styles["reset-button"] + " " + styles["button"]}
                onClick={() => resetGame()}
            >
                Reset Game
            </button>
        </div>
    )
}

// JavaScript supports closures which means an inner function (e.g. handleClick) has access to variables and
// functions defined in a outer function (e.g. Board). The handleClick function can read the squares state and
// call the setSquares method because they are both defined inside of the Board function.
function Board({
    xIsNext,
    squares,
    onPlay,
}: {
    xIsNext: boolean
    squares: (string | null)[]
    onPlay: (nextSquares: (string | null)[]) => void
}) {
    // The handleClick function creates a copy of the squares array (nextSquares) with the JavaScript slice() Array method.
    // Then, handleClick updates the nextSquares array to add X to the appropriate square.
    function handleClick(i: number) {
        if (squares[i] || calculateWinner(squares)) {
            return
        }

        const nextSquares = squares.slice()
        if (xIsNext) {
            nextSquares[i] = "X"
        } else {
            nextSquares[i] = "O"
        }

        onPlay(nextSquares)
    }

    // Update text status to show who next player or winner is
    const winner = calculateWinner(squares)
    let status
    if (winner) {
        status = "Winner: " + winner
    } else {
        status = "Next player: " + (xIsNext ? "X" : "O")
    }

    return (
        <>
            <div className={styles.status}>{status}</div>
            <div className="board-row">
                {/* When the square is clicked, the code after the => “arrow” will run */}
                <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
                <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
                <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
            </div>
            <div className="board-row">
                <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
                <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
                <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
            </div>
            <div className="board-row">
                <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
                <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
                <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
            </div>
        </>
    )
}

function Square({ value, onSquareClick }: { value: string | null; onSquareClick: () => void }) {
    return (
        <button className={styles.square} onClick={onSquareClick}>
            {value}
        </button>
    )
}

function MoveHistory({
    history,
    currentMove,
    setCurrentMove,
}: {
    history: (string | null)[][]
    currentMove: number | null
    setCurrentMove: (nextMove: number) => void
}) {
    function jumpTo(nextMove: number) {
        setCurrentMove(nextMove)
    }

    // _arrayIndex isn't used but is required by the map function as move is the second parameter
    const moveHistory = history.map((_arrayIndex, move) => {
        let description
        if (move == 0) {
            description = "Game start"
        } else if (move == currentMove) {
            description = "Current move"
        } else {
            description = "Go to move #" + move
        }

        let buttonStyles
        if (move == currentMove) {
            buttonStyles = styles["button"] + " " + styles["history-button-current-move"]
        } else {
            buttonStyles = styles["button"]
        }

        return (
            <li key={move}>
                <button className={buttonStyles} onClick={() => jumpTo(move)}>
                    {description}
                </button>
            </li>
        )
    })

    return <>{moveHistory}</>
}

function calculateWinner(squares: (string | null)[]) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ]
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i]
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a]
        }
    }
    return null
}
