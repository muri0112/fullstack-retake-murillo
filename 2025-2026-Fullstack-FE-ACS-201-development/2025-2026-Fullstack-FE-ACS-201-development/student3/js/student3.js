const API_BASE = "2025-2026-fullstack-be-acs-20-uhtd.vercel.app"; 

async function fetchS3Cars(brand, containerId, spinnerId) {
    const container = document.getElementById(containerId);
    const spinner = document.getElementById(spinnerId);
    if (!container || !spinner) return;

    spinner.style.display = 'block';
    container.innerHTML = '';

    try {
        const res = await fetch(`${API_BASE}/items/filter?family=${brand}`);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const cars = await res.json();

        if (cars.length === 0) {
            container.innerHTML = `<div class="col-12"><div class="alert alert-light text-dark">No track inventory found.</div></div>`;
            return;
        }

        cars.forEach(car => {
            container.innerHTML += `
                <div class="col">
                    <div class="card bg-black border border-secondary text-white h-100">
                        <div class="card-body p-4">
                            <h5 class="card-title border-bottom border-danger pb-2 text-uppercase text-danger">${car.name}</h5>
                            <p class="text-muted small">Power Index: ${car.family}</p>
                            <p class="text-danger fw-bold fs-5 mb-0">Base: €${car.price.toLocaleString()}</p>
                        </div>
                    </div>
                </div>`;
        });
    } catch (err) {
        container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Fetch failure: ${err.message}</div></div>`;
    } finally {
        spinner.style.display = 'none';
    }
}

async function handleS3Submit(event, formId, statusId) {
    event.preventDefault();
    const status = document.getElementById(statusId);
    const email = event.target.querySelector('input[type="email"]').value;

    try {
        status.innerHTML = `<div class="text-warning small mt-2">Uploading request parameters...</div>`;
        const res = await fetch(`${API_BASE}/items`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: email, family: "Inquiry S3", price: 0.0 })
        });

        if (res.ok) {
            status.innerHTML = `<div class="text-success small mt-2">Request authorized successfully! </div>`;
            document.getElementById(formId).reset();
        } else {
            throw new Error("Rejected.");
        }
    } catch (err) {
        status.innerHTML = `<div class="text-danger small mt-2">Error: ${err.message}</div>`;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    fetchS3Cars("Ferrari", "ferrari-container", "loading-spinner-ferrari");
    fetchS3Cars("Lamborghini", "lambo-container", "loading-spinner-lambo");

    const f1 = document.getElementById("contact-form-ferrari");
    if(f1) f1.addEventListener("submit", (e) => handleS3Submit(e, "contact-form-ferrari", "status-message-ferrari"));

    const f2 = document.getElementById("contact-form-lambo");
    if(f2) f2.addEventListener("submit", (e) => handleS3Submit(e, "contact-form-lambo", "status-message-lambo"));
});
