// Das ist deine wiederverwendbare Button-Komponente
export default function Button({ text, color, link }) {
    // 'text' und 'color' sind Props (Eigenschaften)
    // 'link' ist eine weitere Prop
    // Sie machen den Button flexibel

    return (
        <button
            className={`px-4 py-2 border-2 rounded ${color}`}
        >
            {text} {link}
        </button>
    )
}