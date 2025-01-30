import express from "express"

const router = express.Router()

router.get("/", (req, res) => {
    res.send(`<h1 id="-the-luxury-hut-node-js-backend-server">🏠 The Luxury Hut - Node.js Backend Server</h1>
<p><img src="https://img.shields.io/badge/Node.js-16.x-green?style=for-the-badge&amp;logo=node.js" alt="Node.js">
<img src="https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&amp;logo=express" alt="Express">
<img src="https://img.shields.io/badge/TypeScript-4.x-blue?style=for-the-badge&amp;logo=typescript" alt="TypeScript"></p>
<h2 id="-about-the-project">🚀 About the Project</h2>
<p><strong>The Luxury Hut Backend Server</strong> is a high-performance, scalable API built using <strong>TypeScript</strong> and <strong>Express.js</strong>. It efficiently manages product operations, file uploads, and logging while maintaining a modular architecture.</p>
<hr>
<h2 id="-live-link">📂 Live link</h2>
<p><a href="https://netqueue-task-backend.onrender.com">https://netqueue-task-backend.onrender.com</a></p>
<hr>
<h2 id="-project-structure">📂 Project Structure</h2>
<pre><code>src/
│── controllers/        <span class="hljs-comment"># Business logic for API endpoints</span>
│── middleware/         <span class="hljs-comment"># Error handling &amp; middleware functions</span>
│── models/             <span class="hljs-comment"># Database models &amp; schemas</span>
│── routes/             <span class="hljs-comment"># API route definitions</span>
│── services/           <span class="hljs-comment"># Business logic services</span>
│── utils/              <span class="hljs-comment"># Utility functions (logging, helpers)</span>
│── app.ts              <span class="hljs-comment"># Main application entry point</span>
uploads/                <span class="hljs-comment"># Storage for uploaded files</span>
.<span class="hljs-keyword">env</span>                    <span class="hljs-comment"># Environment variables</span>
.gitignore              <span class="hljs-comment"># Files ignored by Git</span>
package.json            <span class="hljs-comment"># Project dependencies</span>
tsconfig.json           <span class="hljs-comment"># TypeScript configuration</span>
</code></pre><hr>
<h2 id="-features">⚙️ Features</h2>
<p>✅ <strong>RESTful API</strong> with well-defined routes<br>✅ <strong>TypeScript Support</strong> for maintainability and scalability<br>✅ <strong>Modular Structure</strong> for better code organization<br>✅ <strong>Robust Middleware</strong> for error handling and authentication<br>✅ <strong>Product Management</strong> with CRUD operations<br>✅ <strong>File Upload Handling</strong> via <code>multer</code><br>✅ <strong>Centralized Logging System</strong> for debugging &amp; monitoring  </p>
<hr>
<h2 id="-installation-setup">🔧 Installation &amp; Setup</h2>
<h3 id="1-clone-the-repository">1️⃣ Clone the Repository</h3>
<pre><code class="lang-sh">git <span class="hljs-keyword">clone</span> <span class="hljs-title">https</span>://github.com/dev-sujay/netqueue_task_backend.git
cd netqueue_task_the_luxury_hut
</code></pre>
<h3 id="2-install-dependencies">2️⃣ Install Dependencies</h3>
<pre><code class="lang-sh">npm <span class="hljs-keyword">install</span>
</code></pre>
<h3 id="3-configure-environment-variables">3️⃣ Configure Environment Variables</h3>
<p>Create a <code>.env</code> file and add the necessary configurations:</p>
<pre><code class="lang-sh"><span class="hljs-selector-tag">touch</span> <span class="hljs-selector-class">.env</span>
</code></pre>
<h3 id="4-run-the-server">4️⃣ Run the Server</h3>
<h4 id="-development-mode">🚀 Development Mode</h4>
<pre><code class="lang-sh">npm <span class="hljs-keyword">run</span><span class="bash"> dev</span>
</code></pre>
<h4 id="-production-mode">🚀 Production Mode</h4>
<pre><code class="lang-sh"><span class="hljs-built_in">npm</span> start
</code></pre>
<hr>
<h2 id="-api-endpoints">🛠 API Endpoints</h2>
<table>
<thead>
<tr>
<th>Method</th>
<th>Endpoint</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>GET</td>
<td><code>/api/products</code></td>
<td>Retrieve all products</td>
</tr>
<tr>
<td>POST</td>
<td><code>/api/products</code></td>
<td>Create a new product</td>
</tr>
<tr>
<td>POST</td>
<td><code>/api/products/import</code></td>
<td>import products from csv</td>
</tr>
<tr>
<td>GET</td>
<td><code>/api/products/:id</code></td>
<td>Retrieve a single product</td>
</tr>
<tr>
<td>PUT</td>
<td><code>/api/products/:id</code></td>
<td>Update a product</td>
</tr>
<tr>
<td>DELETE</td>
<td><code>/api/products/:id</code></td>
<td>Delete a product</td>
</tr>
</tbody>
</table>
<p>📌 <strong>More endpoints and features coming soon!</strong></p>
<hr>
<h2 id="-contributing">🤝 Contributing</h2>
<p>We welcome contributions! Follow these steps to contribute:</p>
<ol>
<li><strong>Fork</strong> the repository</li>
<li><strong>Create a feature branch</strong> (<code>git checkout -b feature-name</code>)</li>
<li><strong>Commit your changes</strong> (<code>git commit -m &quot;Add new feature&quot;</code>)</li>
<li><strong>Push to your branch</strong> (<code>git push origin feature-name</code>)</li>
<li><strong>Submit a Pull Request</strong> 🚀</li>
</ol>
<hr>
<h2 id="-author">🔥 Author</h2>
<p>👤 <strong>Your Name</strong><br>📧 paulsujay999@gmail.com<br>🔗 <a href="https://www.linkedin.com/in/dev-sujay/">LinkedIn Profile</a></p>
`)
})

export default router

