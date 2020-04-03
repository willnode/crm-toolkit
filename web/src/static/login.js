import React, {useState} from 'react';
import session from '../main/Session';

async function form_login(e) {
  const data = session.extract(e);
  session.auth = 'Basic ' + btoa(data.get('username') + ':' + data.get('password'));
  try {
    const { login } = await session.get('login');
    session.login = login;
    session.history.push('/' + login.role);
    const storage = window.$('rememberMe').val() ? localStorage : sessionStorage;
    storage.setItem('appauth', session.auth);
    storage.setItem('applogin', JSON.stringify(login));
  } catch {
    session.auth = null;
    session.reload();
  }
}

export default function Login() {
	let [loading, setLoading] = useState(false);
  return (
    <div className="container-fluid bg-info">

      <div className="row justify-content-center">

        <div className="col-xl-10 col-lg-12 col-md-9">

          <div className="card o-hidden border-0 shadow-lg my-5 animated fadeInUp faster">
            <div className="card-body p-0">
              <div className="row justify-content-center">
                <div className="col-lg-6">
                  <div className="p-5">
                    <div className="text-center">
                      <h1 className="h4 text-gray-900 mb-4">Login</h1>
                    </div>
                    <form className="user" onSubmit={(e) => {setLoading(true); form_login(e);}}>
                      <div className="form-group">
                        <input type="text" required className="form-control form-control-user" name="username" placeholder="Email / No HP" autoComplete="email" />
                      </div>
                      <div className="form-group">
                        <input type="password" required className="form-control form-control-user" name="password" placeholder="Password" autoComplete="current-password" />
                      </div>

                      <div className="form-group">
                        <div className="custom-control custom-checkbox small">
                          <input type="checkbox" className="custom-control-input" id="rememberMe"/>
                          <label className="custom-control-label" htmlFor="rememberMe">
                            Remember Me
                          </label>
                        </div>
                      </div>
                      <button disabled={loading} className="btn btn-primary btn-user btn-block">
                        Login
                    </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}