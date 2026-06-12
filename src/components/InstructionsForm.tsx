import React from "react";

type InstractionsFormProps = {
    instructions: string[];
    onChange: (instructions: string[]) => void;
};

export default function InstructionsForm({ instructions, onChange }: InstractionsFormProps) {
    function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>, index: number) {
        const updatedInstructions = instructions.map((instr, i) => {
            return i === index ? e.target.value : instr;
        });
        onChange(updatedInstructions);
    }

    function handleRemove(index: number) {
        const updatedInstructions = instructions.filter((_, i) => index !== i);
        onChange(updatedInstructions);
    }

    function addInstruction() {
        onChange([...instructions, ""]);
    }

    return (
        <fieldset>
            <legend>Instructions</legend>

            {instructions.map((instruction, index) => (
                <div key={index}>
                    <label>
                        {index + 1}
                        <textarea value={instruction} onChange={(e) => handleChange(e, index)} />
                    </label>

                    <button type="button" onClick={() => handleRemove(index)} aria-label="Remove ingredient">
                        X
                    </button>
                </div>
            ))}

            <button type="button" onClick={addInstruction}>
                Add instruction
            </button>
        </fieldset>
    );
}
