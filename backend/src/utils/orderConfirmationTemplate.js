import { Config } from "../config/env.js";

/**
 * Generates an HTML order confirmation email.
 * @param {Object} opts
 * @param {string} opts.name        - Customer's full name
 * @param {string} opts.orderId     - Razorpay order ID
 * @param {number} opts.amount      - Total amount in INR
 * @param {string} opts.currency    - Currency string e.g. "INR"
 * @param {Array}  opts.items       - Array of cart item objects (with price, quantity)
 */
export const orderConfirmationTemplate = ({ name, orderId, amount, currency = "INR", items = [] }) => {
  const itemRows = items.map((item) => `
    <tr>
      <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: rgba(255,255,255,0.75); vertical-align: middle;">
        ${item.quantity}×
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: rgba(255,255,255,0.85);">
        Item
      </td>
      <td style="padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 13px; color: #C8A96E; text-align: right; font-weight: 700;">
        ${currency} ${((item.price?.amount || 0) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0d0d0d; margin: 0; padding: 0; color: #ffffff; }
      .container { max-width: 520px; margin: 48px auto; background: #111111; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); box-shadow: 0 0 40px rgba(255,255,255,0.04); }
      .header { background: #0d0d0d; padding: 36px 40px 28px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.06); }
      .logo-icon { display: inline-flex; width: 52px; height: 52px; background: #2C3E29; border-radius: 14px; align-items: center; justify-content: center; margin-bottom: 16px; }
      .logo-text { font-size: 22px; font-weight: 900; letter-spacing: -0.5px; color: #ffffff; margin: 0; text-transform: uppercase; font-style: italic; }
      .content { padding: 40px; }
      .badge { display: inline-block; background: rgba(200,169,110,0.12); border: 1px solid rgba(200,169,110,0.25); border-radius: 100px; padding: 6px 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.15em; color: #C8A96E; text-transform: uppercase; margin-bottom: 20px; }
      h1 { font-size: 24px; font-weight: 900; margin: 0 0 10px; color: #ffffff; letter-spacing: -0.5px; }
      .subtitle { color: rgba(255,255,255,0.4); font-size: 14px; line-height: 1.6; margin: 0 0 32px; }
      .order-id-box { background: #1a1a1a; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; padding: 16px 20px; margin-bottom: 28px; display: flex; align-items: center; justify-content: space-between; }
      .order-id-label { font-size: 10px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: rgba(255,255,255,0.3); }
      .order-id-value { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.7); font-family: monospace; }
      table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
      .total-row td { padding: 20px 0 0; font-size: 16px; font-weight: 900; color: #ffffff; }
      .total-row .amount { color: #C8A96E; font-size: 22px; text-align: right; }
      .divider { border: none; border-top: 1px solid rgba(255,255,255,0.05); margin: 28px 0; }
      .cta-btn { display: inline-block; background: #2C3E29; color: #F4F1EB; font-size: 11px; font-weight: 900; letter-spacing: 0.18em; text-transform: uppercase; padding: 14px 32px; border-radius: 100px; text-decoration: none; }
      .footer { padding: 20px 40px; text-align: center; font-size: 11px; color: rgba(255,255,255,0.15); border-top: 1px solid rgba(255,255,255,0.05); letter-spacing: 0.02em; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="logo-icon">
          <span style="color: #F4F1EB; font-size: 22px; font-weight: 900; font-style: italic;">S</span>
        </div>
        <p class="logo-text">Snitch</p>
      </div>
      <div class="content">
        <div class="badge">Order Confirmed ✓</div>
        <h1>Your order is in.</h1>
        <p class="subtitle">Hey ${name}, we've received your order and we're getting it ready. You'll receive another email when it ships.</p>

        <div class="order-id-box">
          <div>
            <p class="order-id-label">Order Reference</p>
            <p class="order-id-value">${orderId}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="text-align:left; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.25); padding-bottom:12px;" colspan="2">Item</th>
              <th style="text-align:right; font-size:10px; font-weight:700; letter-spacing:0.15em; text-transform:uppercase; color:rgba(255,255,255,0.25); padding-bottom:12px;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemRows}
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="2">Total Paid</td>
              <td class="amount">${currency} ${Number(amount).toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>

        <hr class="divider">
        <div style="text-align:center;">
          <a href="${Config.FRONTEND_URL}/orders" class="cta-btn">View My Orders</a>
        </div>
      </div>
      <div class="footer">
        &copy; ${new Date().getFullYear()} Snitch Clothing Pvt Ltd &nbsp;&middot;&nbsp; All Rights Reserved
      </div>
    </div>
  </body>
  </html>
  `;
};
