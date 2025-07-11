document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("invitacionForm");

    if (!form) {
        console.error('No se encontró el formulario con id "invitacionForm"');
        return;
    }

    // URL de tu Google Apps Script
    const scriptURL =
        "https://script.google.com/macros/s/AKfycbwuGHPe-X0NZ2T5a6tWfnczK_h_bt3rUS8s864cpS1eE2cRmyLJS5_GtNG43mnIzBFcjA/exec";

    // Función para validar el formulario
    window.validateForm = function () {
        const name = document.getElementById("guest-name").value.trim();
        const optionSelected =
            document.querySelector('input[name="asistencia"]:checked') !== null;
        const submitBtn = document.getElementById("submit-btn");
        if (submitBtn) {
            submitBtn.disabled = !(name && optionSelected);
        }
    };

    // Función para manejar el envío (SOLUCIÓN CORS)
    async function handleSubmit(e) {
        e.preventDefault();

        const submitBtn = document.getElementById('submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando...';

        try {
            const formData = new FormData(document.getElementById('invitacionForm'));
            const objectData = Object.fromEntries(formData.entries());

            // Usar GET con parámetros en la URL para evitar CORS
            const params = new URLSearchParams(objectData).toString();
            const response = await fetch(`${scriptURL}?${params}`, {
                method: 'GET',  // Cambiado a GET para evitar CORS
                mode: 'no-cors' // Ignorar políticas de CORS
            });

            // Como no se puede leer la respuesta en modo no-cors, asumimos éxito
            document.getElementById('invitacionForm').style.display = 'none';
            document.getElementById('thank-you').style.display = 'block';

        } catch (error) {
            console.error('Error:', error);
            alert('Error al enviar. Inténtalo nuevamente.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    // Función para resetear el formulario
    window.resetForm = function () {
        form.reset();
        document.querySelectorAll(".radio-option").forEach((option) => {
            option.classList.remove("selected");
        });
        form.style.display = "block";
        document.getElementById("thank-you").style.display = "none";
        validateForm();
    };

    // Event listeners
    form.addEventListener("submit", handleSubmit);
    document.getElementById("guest-name").addEventListener("input", validateForm);

    // Añadir event listeners a los radio buttons
    document.querySelectorAll('input[name="asistencia"]').forEach((radio) => {
        radio.addEventListener("change", validateForm);
    });

    // Validación inicial
    validateForm();
});

// Función global para selección de opción
function selectOption(value) {
    document.querySelectorAll(".radio-option").forEach((option) => {
        option.classList.remove("selected");
    });

    const selectedOption =
        value === "yes"
            ? document.querySelector("#attending-yes").parentElement
            : document.querySelector("#attending-no").parentElement;

    if (selectedOption) {
        selectedOption.classList.add("selected");
        const radio = document.querySelector(`#attending-${value}`);
        if (radio) radio.checked = true;

        // Llamar a validación después de seleccionar
        if (typeof validateForm === "function") {
            validateForm();
        }
    }
}
