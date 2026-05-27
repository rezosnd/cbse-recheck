import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const Timer = () => {
  const [targetTime, setTargetTime] = useState('');

  useEffect(() => {
    const now = new Date();
    now.setHours(13, 0, 0, 0); // Default to 1 PM today
    
    // Format to YYYY-MM-DDThh:mm
    const pad = (n) => n.toString().padStart(2, '0');
    const defaultTime = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
    
    setTargetTime(defaultTime);
  }, []);

  // The local preview needs to use localhost so you can see it before deploying.
  // The public email needs the production URL because Gmail's servers cannot read 'localhost'.
  const getTimerUrl = (forPreview) => {
    if (!targetTime) return '';
    const ts = new Date(targetTime).toISOString();
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    
    const baseUrl = (forPreview && isDev) 
      ? 'http://localhost:5000' 
      : 'https://api-recheck.veritasco.tech';
      
    return `${baseUrl}/api/timer/gif?target=${encodeURIComponent(ts)}`;
  };
  
  const previewTimerGifUrl = getTimerUrl(true);
  const publicTimerGifUrl = getTimerUrl(false);

  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VeritasCo Price Update</title>
</head>
<body style="margin:0;padding:0;background-color:#0A0A0B;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" align="center" style="background-color:#0A0A0B;padding:40px 10px;">
        <tr>
            <td align="center">
                
                <table width="500" border="0" cellspacing="0" cellpadding="0" align="center" style="width:100%;max-width:500px;margin:auto;text-align:center;background-color:#121214;border:1px solid #222226;border-radius:16px;padding:40px 30px;box-shadow: 0 10px 40px rgba(0,0,0,0.8);">
                    
                    <tr>
                        <td align="center">
                            <h1 style="margin:0 0 8px 0;font-size:32px;color:#ffffff;font-weight:800;letter-spacing:-0.5px;">
                                Apply Before 1 PM
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td align="center">
                            <p style="margin:0 0 24px 0;color:#ff3b3b;font-size:14px;font-weight:700;letter-spacing:3px;text-transform:uppercase;">
                                Price Increase Today
                            </p>
                        </td>
                    </tr>

                    ${publicTimerGifUrl ? `
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <img src="${publicTimerGifUrl}" width="350" style="display:block;width:100%;max-width:350px;border-radius:8px;border:1px solid #222226;" alt="Countdown Timer" />
                        </td>
                    </tr>
                    ` : ''}

                    <tr>
                        <td align="center">
                            <p style="margin:0 0 20px 0;color:#a1a1aa;font-size:16px;line-height:1.6;">
                                More than <span style="color:#25D366;font-weight:600;">100+ students</span> have already received their recheck reports successfully.
                            </p>
                            <p style="margin:0 0 32px 0;color:#a1a1aa;font-size:16px;line-height:1.6;">
                                Demo report attached below.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0">
                                <tr>
                                    <td width="48%" valign="top" style="background-color:#18181b;border:1px solid #27272a;border-radius:12px;padding:24px 16px;text-align:center;">
                                        <p style="margin:0 0 16px 0;color:#71717a;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">Current Prices</p>
                                        <p style="margin:0 0 10px 0;color:#e4e4e7;font-size:15px;font-weight:500;">1 Copy &nbsp;<span style="color:#25D366;font-weight:700;">₹39</span></p>
                                        <p style="margin:0 0 10px 0;color:#e4e4e7;font-size:15px;font-weight:500;">2 Copies &nbsp;<span style="color:#25D366;font-weight:700;">₹49</span></p>
                                        <p style="margin:0;color:#e4e4e7;font-size:15px;font-weight:500;">3+ Copies &nbsp;<span style="color:#25D366;font-weight:700;">₹69</span></p>
                                    </td>
                                    <td width="4%"></td>
                                    <td width="48%" valign="top" style="background-color:#1c1314;border:1px solid #3f1515;border-radius:12px;padding:24px 16px;text-align:center;">
                                        <p style="margin:0 0 16px 0;color:#ff3b3b;font-size:12px;text-transform:uppercase;letter-spacing:1px;font-weight:bold;">After 1 PM</p>
                                        <p style="margin:0 0 10px 0;color:#e4e4e7;font-size:15px;font-weight:500;">1 Copy &nbsp;<span style="color:#ff3b3b;font-weight:700;">₹49</span></p>
                                        <p style="margin:0 0 10px 0;color:#e4e4e7;font-size:15px;font-weight:500;">2 Copies &nbsp;<span style="color:#ff3b3b;font-weight:700;">₹69</span></p>
                                        <p style="margin:0;color:#e4e4e7;font-size:15px;font-weight:500;">3+ Copies &nbsp;<span style="color:#ff3b3b;font-weight:700;">₹89</span></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td align="center">
                            <p style="margin:0 0 32px 0;color:#e4e4e7;font-size:15px;line-height:1.6;font-weight:500;">
                                Apply before 1 PM to lock your current lower pricing.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="padding-bottom:40px;">
                            <a href="https://recheck.veritasco.tech/" style="background-color:#ff3b3b;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:30px;font-size:16px;font-weight:bold;display:inline-block;border:1px solid #ff4d4d;">
                                Apply Now
                            </a>
                        </td>
                    </tr>

                    <tr>
                        <td align="center" style="border-top:1px solid #222226;padding-top:24px;">
                            <p style="margin:0 0 16px 0;color:#71717a;font-size:13px;line-height:1.6;">
                                Kindly share VeritasCo on <span style="color:#e4e4e7;font-weight:bold;">X</span>, <span style="color:#25D366;font-weight:bold;">WhatsApp</span> & <span style="color:#ff5700;font-weight:bold;">Reddit</span> to help more students.
                            </p>
                            <img src="https://recheck.veritasco.tech/veritasco.png" width="40" style="display:block;margin:0 auto 12px auto;opacity:0.4;filter:grayscale(100%);">
                            <p style="margin:0;color:#52525b;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;">
                                Powered by Team VeritasCo
                            </p>
                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>
</body>
</html>
  `.trim();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(emailHtml);
    toast.success('Raw HTML copied to clipboard!');
  };

  const handleCopyRichText = async () => {
    try {
      const blobHtml = new Blob([emailHtml], { type: 'text/html' });
      const clipboardItem = new ClipboardItem({
        'text/html': blobHtml
      });
      await navigator.clipboard.write([clipboardItem]);
      toast.success('Rich text copied! Now paste into Gmail compose window.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to copy rich text. Your browser might not support this feature.');
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto dark:text-white">
      <div className="flex flex-col gap-8">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Email Timer Generator</h1>
            <p className="text-gray-500 mt-1">Configure your countdown timer and copy the cool design directly into Gmail.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleCopyHtml}
              className="px-5 py-2.5 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition font-medium border border-gray-700"
            >
              Copy HTML
            </button>
            <button
              onClick={handleCopyRichText}
              className="px-5 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-medium shadow-[0_0_15px_rgba(239,68,68,0.3)] border border-red-500"
            >
              Copy for Gmail
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Timer Settings
              </h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Timer Deadline
                  </label>
                  <input
                    type="datetime-local"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500 outline-none transition dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-3 leading-relaxed">
                    Set the exact date and time the countdown should end. The generated GIF uses IST (Asia/Kolkata).
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-900/10 p-5 rounded-2xl border border-red-100 dark:border-red-900/30">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-400 mb-2">How to use</h3>
              <ol className="text-sm text-red-700 dark:text-red-300/80 space-y-2 list-decimal list-inside">
                <li>Set your desired expiry time above.</li>
                <li>Preview the email on the right.</li>
                <li>Click <strong>Copy for Gmail</strong>.</li>
                <li>Open Gmail, compose a new email, and simply paste (Ctrl+V or Cmd+V) into the message body.</li>
              </ol>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-[#0f172a] p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 flex flex-col h-full">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Live Preview (Local)
              </h2>
              <div className="w-full flex-grow min-h-[700px] border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden bg-[#0A0A0B]">
                <iframe
                  srcDoc={emailHtml.replace(publicTimerGifUrl, previewTimerGifUrl)}
                  className="w-full h-full min-h-[700px]"
                  title="Email Preview"
                />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Timer;
