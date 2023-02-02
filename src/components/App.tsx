import styles from "./App.module.css"

function Square({ value }: { value: string }) {
    function handleClick() {
        console.log("Clicked!")
    }

    return (
        <button className={styles.square} onClick={handleClick}>
            {value}
        </button>
    )
}

export default function Board() {
    return (
        <>
            <div className="board-row">
                <Square value="1" />
                <Square value="2" />
                <Square value="3" />
            </div>
            <div className="board-row">
                <Square value="4" />
                <Square value="5" />
                <Square value="6" />
            </div>
            <div className="board-row">
                <Square value="7" />
                <Square value="8" />
                <Square value="9" />
            </div>
        </>
    )
}