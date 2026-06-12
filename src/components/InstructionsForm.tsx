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
        <fieldset className="recipe-form__fieldset">
            <legend>Instructions</legend>

            <div className="recipe-form__items">
                {instructions.map((instruction, index) => (
                    <div className="recipe-form__instruction-row" key={index}>
                        <label className="recipe-form__field">
                            Step {index + 1}
                            <textarea value={instruction} onChange={(e) => handleChange(e, index)} />
                        </label>

                        <button className="recipe-form__remove-button" type="button" onClick={() => handleRemove(index)} aria-label="Remove instruction">
                            X
                        </button>
                    </div>
                ))}
            </div>

            <button className="recipe-form__secondary-button" type="button" onClick={addInstruction}>
                Add instruction
            </button>
        </fieldset>
    );
}
