/**
 * NexalapPlatformDataReauth — PlatformData Connector user-account 재인증 공통 레이어.
 *
 * -2713(PLATFORMDATA_REAUTH_REQUIRED) 응답을 판정하고, 기본 credential prompt 모달을 렌더링해
 * POST /ide/platformdata/session 으로 세션을 확립한 뒤 호출측이 등록한 재시도 콜백을 실행한다.
 * IDE 워크플로우 테스트와 배포 런타임 앱이 동일하게 사용하는 계약이다.
 *
 * -2714(PLATFORMDATA_USER_CONTEXT_REQUIRED)는 자격증명 모달 대상이 아니다 — NexaLAP 로그인 신원이
 * 없는 상태이므로 isNexalapLoginRequired()로 판정해 애플리케이션 로그인 화면으로 유도한다.
 *
 * 보안: 비밀번호는 모듈 상태/localStorage/URL에 보관하지 않는다. 세션 확립 요청 직후 폐기한다.
 * 외부 CDN 의존 없음 (self-contained).
 *
 * 사용법(기본 모달):
 *   NexalapPlatformDataReauth.handle(errorResponse, {
 *     project: 'DevProProject',
 *     currentUserId: 'kim.admin',        // 선택 — 아이디 입력란 기본값
 *     retry: () => fetch(...).then(r => r.json())  // 세션 확립 성공 시 재실행할 원 요청
 *   }).then(result => { ... });
 *
 * 사용법(커스텀 UI로 기본 모달 대체):
 *   NexalapPlatformDataReauth.registerHandler((required, ctx) => {
 *     // required: [{name,label,secret,optional}, ...], ctx: {currentUserId, errorMessage}
 *     // 반환: Promise<{userId, userPwd}> (취소 시 reject)
 *     return myOwnPromptImplementation(required, ctx);
 *   });
 */
(function (global) {
    'use strict';

    // 이 스크립트가 실제로 로드된 origin을 기준으로 API를 호출한다. platformdata-reauth.html처럼
    // NexaLAP 서버가 직접 서빙하는 페이지에서는 상대경로로도 문제없지만, 배포 런타임 앱이 이
    // 스크립트를 다른 origin(예: 별도 프론트엔드 dev 서버)에서 동적으로 <script src="{서버}/platformdata-reauth.js">로
    // 불러오는 경우 상대경로로 두면 요청이 로드한 페이지의 origin으로 나가버린다(2026-07-16 실서버 확인 —
    // localhost:3002에서 실행 중인 앱이 자기 자신에게 /ide/platformdata/session을 쏴서 404/HTML 응답을 받음).
    var SCRIPT_ORIGIN = (function () {
        try {
            return new URL(document.currentScript.src).origin;
        } catch (e) {
            return ''; // document.currentScript 사용 불가 시 상대경로로 폴백(기존 동작 유지)
        }
    })();

    var SESSION_ENDPOINT = SCRIPT_ORIGIN + '/ide/platformdata/session';
    var DEFAULT_REQUIRED = [
        { name: 'userId', label: '아이디', secret: false, optional: true },
        { name: 'userPwd', label: '비밀번호', secret: true, optional: false }
    ];

    var customHandler = null;

    /** -2713(재인증 필요) 응답 판정. */
    function isReauthRequired(response) {
        return !!response &&
            response.errorcode === -2713 &&
            !!response.result &&
            response.result.type === 'platformdata-reauth-required';
    }

    /**
     * -2714(NexaLAP 로그인 필요) 응답 판정.
     * -2713과 달리 레거시 자격증명 모달로 해결할 수 없다 — 격리 기준이 될 NexaLAP 신원 자체가 없는
     * 상태(비로그인 앱/공개 워크플로우에서 user-account datasource 호출)이므로, 앱은 이 응답을 받으면
     * 자격증명 모달 대신 애플리케이션 로그인 화면으로 유도해야 한다.
     */
    function isNexalapLoginRequired(response) {
        return !!response && response.errorcode === -2714;
    }

    /** 기본 모달 UI를 대체할 custom handler 등록. null을 넘기면 기본 모달로 되돌린다. */
    function registerHandler(handler) {
        customHandler = (typeof handler === 'function') ? handler : null;
    }

    /**
     * POST /ide/platformdata/session 호출. credentials는 이 호출에서만 사용하고
     * 응답을 받은 즉시 참조를 버린다 (모듈 상태에 보관하지 않음).
     *
     * @param identityToken authurl 쿼리스트링의 identitytoken(선택) — 계정 연결 페이지가 실행 요청과
     *        쿠키를 공유하지 못하는 브라우저 컨텍스트에서 열리는 경우를 위한 대안 신원 경로(2026-07-16).
     *        쿠키 기반 판정보다 서버에서 우선 신뢰한다.
     */
    function establishSession(project, datasource, credentials, identityToken) {
        var credentialList = Object.keys(credentials || {}).map(function (name) {
            return { name: name, value: credentials[name] };
        });
        var payload = {
            params: {
                project: project,
                data: {
                    datasource: datasource,
                    credentials: credentialList,
                    identitytoken: identityToken || undefined
                }
            }
        };
        return fetch(SESSION_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin', // NexaLAP Authentication 세션 쿠키(JSESSIONID)를 명시적으로 동봉 —
                                         // 브라우저/임베디드 웹뷰에 따라 fetch()의 쿠키 기본 동작이 달라
                                         // 지정하지 않으면 팝업 창에서 쿠키가 누락되는 경우가 있었다(2026-07-16 발견).
            body: JSON.stringify(payload)
        }).then(function (res) {
            return res.json();
        });
    }

    /**
     * required[] 자격증명을 확보하고 세션을 획득할 때까지 반복하는 공통 루프.
     * 실패 시(-2715) 마지막 에러 메시지를 다음 프롬프트에 전달해 재입력을 받는다.
     * 자격증명 확보가 reject되면(사용자 취소) 그대로 전파한다.
     */
    function establishLoop(required, project, datasource, currentUserId, identityToken, label) {
        var resolveCredentials = customHandler || defaultModalHandler;
        var lastError = null;

        function attempt() {
            return Promise.resolve(resolveCredentials(required, { currentUserId: currentUserId, errorMessage: lastError, label: label }))
                .then(function (credentials) {
                    return establishSession(project, datasource, credentials, identityToken).then(function (establishResult) {
                        credentials = null; // 세션 확립 응답을 받는 즉시 폐기
                        if (establishResult && establishResult.errorcode === 0) {
                            return establishResult;
                        }
                        lastError = (establishResult && establishResult.errormessage) || '로그인에 실패했습니다.';
                        return attempt();
                    });
                });
        }

        return attempt();
    }

    /**
     * -2713 응답을 소비해 재인증 → 세션 확립 → 원 요청 재시도까지 처리한다.
     *
     * @param response -2713 응답 전체 (errorcode/errormessage/result)
     * @param options   { project, datasource?(응답의 result.datasource로 대체 가능),
     *                    currentUserId?, identityToken?, label?, retry?: () => any|Promise }
     * @return Promise — retry가 있으면 그 결과, 없으면 세션 확립 응답
     */
    function handle(response, options) {
        if (isNexalapLoginRequired(response)) {
            // 레거시 재인증으로 해결 불가 — 호출측이 애플리케이션 로그인으로 유도해야 한다.
            return Promise.reject(new Error((response && response.errormessage) ||
                '로그인이 필요한 서비스입니다. 애플리케이션에 로그인한 후 다시 시도해주세요.'));
        }
        if (!isReauthRequired(response)) {
            return Promise.reject(new Error('NexalapPlatformDataReauth.handle(): response is not a platformdata-reauth-required response'));
        }
        options = options || {};
        var result = response.result || {};
        var required = result.required || DEFAULT_REQUIRED;
        var datasource = options.datasource || result.datasource;
        var project = options.project;

        return establishLoop(required, project, datasource, options.currentUserId, options.identityToken, options.label).then(function () {
            if (typeof options.retry === 'function') {
                return options.retry();
            }
            return true;
        });
    }

    /**
     * 자격증명 프롬프트부터 시작하는 진입점 — 원 -2713 응답 없이(예: 재인증 셸 페이지)
     * project/datasource만으로 세션획득을 수행한다. required[]는 고정 기본값을 사용한다.
     *
     * @param options { project, datasource, currentUserId?, identityToken?, label? }
     * @return Promise<sessionResponse>
     */
    function promptAndEstablish(options) {
        options = options || {};
        return establishLoop(DEFAULT_REQUIRED, options.project, options.datasource, options.currentUserId, options.identityToken, options.label);
    }

    // ===== 기본 모달 (DOM 기반, 임베디드 CSS — 외부 의존 없음) =====

    var STYLE_ID = 'nexalap-pd-reauth-style';

    function injectStyleOnce() {
        if (document.getElementById(STYLE_ID)) return;
        var style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent =
            '.nexalap-pd-reauth-overlay {' +
            '  position: fixed; inset: 0; background: rgba(0,0,0,0.45);' +
            '  display: flex; align-items: center; justify-content: center; z-index: 2147483000;' +
            '  font-family: sans-serif;' +
            '}' +
            '.nexalap-pd-reauth-modal {' +
            '  background: #fff; border-radius: 8px; box-shadow: 0 4px 16px rgba(0,0,0,0.25);' +
            '  width: 320px; padding: 24px;' +
            '}' +
            '.nexalap-pd-reauth-modal h3 {' +
            '  margin: 0 0 4px; font-size: 16px; color: #333;' +
            '}' +
            '.nexalap-pd-reauth-sub {' +
            '  font-size: 12px; color: #888; margin: 0 0 16px;' +
            '}' +
            '.nexalap-pd-reauth-error {' +
            '  background: #fdecea; color: #b71c1c; font-size: 12px;' +
            '  border-radius: 4px; padding: 8px 10px; margin-bottom: 12px;' +
            '}' +
            '.nexalap-pd-reauth-field { margin-bottom: 12px; }' +
            '.nexalap-pd-reauth-field label {' +
            '  display: block; font-size: 12px; font-weight: bold; color: #333; margin-bottom: 4px;' +
            '}' +
            '.nexalap-pd-reauth-field input {' +
            '  width: 100%; box-sizing: border-box; padding: 8px 10px;' +
            '  border: 1px solid #ccc; border-radius: 4px; font-size: 13px;' +
            '}' +
            '.nexalap-pd-reauth-field input:focus {' +
            '  outline: none; border-color: #007bff; box-shadow: 0 0 0 2px rgba(0,123,255,0.15);' +
            '}' +
            '.nexalap-pd-reauth-actions {' +
            '  display: flex; justify-content: flex-end; gap: 8px; margin-top: 20px;' +
            '}' +
            '.nexalap-pd-reauth-actions button {' +
            '  border: none; border-radius: 4px; padding: 8px 16px; font-size: 13px; cursor: pointer;' +
            '}' +
            '.nexalap-pd-reauth-cancel { background: #e9ecef; color: #333; }' +
            '.nexalap-pd-reauth-cancel:hover { background: #dde1e4; }' +
            '.nexalap-pd-reauth-login { background: #007bff; color: #fff; }' +
            '.nexalap-pd-reauth-login:hover { background: #0056b3; }';
        document.head.appendChild(style);
    }

    /**
     * 기본 credential prompt 모달. required[] 메타데이터로 폼을 렌더링한다.
     * @return Promise<{[name]: value}> — Cancel 시 reject
     */
    function defaultModalHandler(required, ctx) {
        injectStyleOnce();
        ctx = ctx || {};

        return new Promise(function (resolve, reject) {
            var overlay = document.createElement('div');
            overlay.className = 'nexalap-pd-reauth-overlay';

            var modal = document.createElement('div');
            modal.className = 'nexalap-pd-reauth-modal';
            overlay.appendChild(modal);

            var title = document.createElement('h3');
            title.textContent = '로그인이 필요합니다';
            modal.appendChild(title);

            var sub = document.createElement('p');
            sub.className = 'nexalap-pd-reauth-sub';
            // datasource 설정의 reauthlabel(최종 사용자 안내 문구, 2026-07-16)이 있으면 그걸 쓰고,
            // 없으면 기존 일반 문구로 폴백한다 — platformdata-reauth.html의 label 처리와 동일 정책.
            sub.textContent = ctx.label || '외부 시스템 접속을 위해 다시 로그인해주세요.';
            modal.appendChild(sub);

            if (ctx.errorMessage) {
                var errorBox = document.createElement('div');
                errorBox.className = 'nexalap-pd-reauth-error';
                errorBox.textContent = ctx.errorMessage;
                modal.appendChild(errorBox);
            }

            var inputs = {};
            required.forEach(function (field) {
                var wrap = document.createElement('div');
                wrap.className = 'nexalap-pd-reauth-field';

                var label = document.createElement('label');
                label.textContent = field.label || field.name;
                wrap.appendChild(label);

                var input = document.createElement('input');
                input.type = field.secret ? 'password' : 'text';
                if (field.name === 'userId' && ctx.currentUserId) {
                    input.value = ctx.currentUserId;
                }
                wrap.appendChild(input);
                modal.appendChild(wrap);
                inputs[field.name] = input;
            });

            var actions = document.createElement('div');
            actions.className = 'nexalap-pd-reauth-actions';
            modal.appendChild(actions);

            var cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'nexalap-pd-reauth-cancel';
            cancelBtn.textContent = '취소';
            actions.appendChild(cancelBtn);

            var loginBtn = document.createElement('button');
            loginBtn.type = 'button';
            loginBtn.className = 'nexalap-pd-reauth-login';
            loginBtn.textContent = '로그인';
            actions.appendChild(loginBtn);

            function cleanup() {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
            }

            cancelBtn.addEventListener('click', function () {
                cleanup();
                reject(new Error('cancelled'));
            });

            loginBtn.addEventListener('click', function () {
                var credentials = {};
                required.forEach(function (field) {
                    credentials[field.name] = inputs[field.name].value;
                    inputs[field.name].value = ''; // DOM에서 즉시 비움
                });
                cleanup();
                resolve(credentials);
            });

            document.body.appendChild(overlay);
            var firstInput = inputs[required[0] && required[0].name];
            if (firstInput) firstInput.focus();
        });
    }

    global.NexalapPlatformDataReauth = {
        isReauthRequired: isReauthRequired,
        isNexalapLoginRequired: isNexalapLoginRequired,
        registerHandler: registerHandler,
        handle: handle,
        promptAndEstablish: promptAndEstablish
    };
})(window);
