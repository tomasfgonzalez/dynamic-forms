// src/components/schemasPageComponents/CreateSchemaModal.tsx
import React from "react";
import CreateFromScratch from "./Modals/EditTab";
import ImportSchema from "./Modals/ImportTab";
import ExampleSchemas from "./Modals/ExamplesTab";
import { useSchemaModalStep } from "../../hooks/SchemaPage/useModalStep";
import type { Schema } from "../../hooks/SchemaPage/useSchemas";
import "./CreateModal.css";

interface CreateSchemaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schema: Schema) => void;
  editingSchema: Schema | null;
  existingSchemas: Schema[];
}

const CreateSchemaModal: React.FC<CreateSchemaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingSchema,
  existingSchemas,
}) => {
  const { step, goToLanding, goToScratch, goToImport, goToExamples } =
    useSchemaModalStep(isOpen, editingSchema);

  if (!isOpen) return null;

  const handleSaveAndClose = (schema: Schema) => {
    onSave(schema);
    onClose();
  };

  const handleExampleSelect = (schema: Schema) => {
    const exists = existingSchemas.some((s) => s.id === schema.id);
    if (exists) {
      onClose();
    } else {
      onSave(schema);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content fade-in">
        {step === "landing" && (
          <>
            <h2>Create a New Schema</h2>
            <div className="modal-options">
              <div className="option-card" onClick={goToScratch}>
                <div className="option-icon">✏️</div>
                <div className="option-text">
                  <strong>Create From Scratch</strong>
                  <p>Build a schema manually from empty fields.</p>
                </div>
              </div>
              <div className="option-card" onClick={goToImport}>
                <div className="option-icon">📄</div>
                <div className="option-text">
                  <strong>Import JSON</strong>
                  <p>Paste or upload an existing JSON schema.</p>
                </div>
              </div>
              <div className="option-card" onClick={goToExamples}>
                <div className="option-icon">💡</div>
                <div className="option-text">
                  <strong>Try Our Examples</strong>
                  <p>Start with a predefined example schema.</p>
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={onClose}>Cancel</button>
            </div>
          </>
        )}

        {step === "scratch" && (
          <CreateFromScratch
            editingSchema={editingSchema}
            existingSchemas={existingSchemas}
            onSave={handleSaveAndClose}
            onCancel={() => (editingSchema ? onClose() : goToLanding())}
          />
        )}

        {step === "import" && (
          <ImportSchema onImport={handleSaveAndClose} onCancel={goToLanding} />
        )}

        {step === "examples" && (
          <ExampleSchemas onSelect={handleExampleSelect} onCancel={goToLanding} />
        )}
      </div>
    </div>
  );
};

export default CreateSchemaModal;
