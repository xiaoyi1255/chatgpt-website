import express from 'express'
import jsSHA from 'jssha'
const router = express.Router();
import redisCkient from '../utils/redis'
import { parseString } from 'xml2js'


router.get('/wechat', (req, res, next) => {
	const token = 'xiaoyi1255';
	//1.获取微信服务器Get请求的参数 signature、timestamp、nonce、echostr
	const { signature, timestamp, nonce, echostr } = req.query;
	console.log(req.query);
	//2.将token、timestamp、nonce三个参数进行字典序排序
	const array = [token, timestamp, nonce].sort();

	//3.将三个参数字符串拼接成一个字符串进行sha1加密
	const tempStr = array.join('');
	const shaObj = new jsSHA('SHA-1', 'TEXT');
	shaObj.update(tempStr);
	const scyptoString = shaObj.getHash('HEX');

	//4.开发者获得加密后的字符串可与signature对比，标识该请求来源于微信
	console.log('signature', signature);
	console.log('scyptoString', scyptoString);
	if (signature === scyptoString) {
		console.log('验证成功');
		res.send(echostr);
	} else {
		console.log('验证失败');
		res.send('验证失败');
	}
});

router.post('/wechat', function (req, res) {
	var buffer = [];
	req.on('data', function (data) {
		buffer.push(data);
	});
	// 内容接收完毕
	req.on('end', function () {
		var msgXml = Buffer.concat(buffer).toString('utf-8');
		parseString(msgXml, { explicitArray: false }, async function (err, result) {
			if (err) throw err;
			result = result.xml;
			const { ToUserName, FromUserName, MsgType, Content } = result;
			if (MsgType === 'text' && Content === '登录') {
				const code = randomCode();
				// 5分钟有效期
				// 这里的FromUserName就是用户的OpenID
				// await redisCkient.setEX(FromUserName, code, 60 * 5);
				await redisCkient.setEX(code, code, 60 * 60 * 1);
				const sendXml = sendTextMsg(
					ToUserName,
					FromUserName,
					`您的登录验证码是：${code} `
				);
				res.send(sendXml);
			}
		});
	});
});

router.post('/verifyCode', async function (req, res) {
	const { code } = req.body;
	const OpenID = await redisCkient.get(code);
	console.log(OpenID, code);
	if (OpenID) {
		// const token = '使用OpenID进行jwt鉴权颁发Token';
		res.status(200).json({
			status: 'Success',
			data: {
				token: code
			}
		});
	} else {
		res.status(200).json({
			status: 'Fail',
			// status: 'Success',
			data: null,
			msg: '您输入的验证码有误或已过期，请重新输入！-_-'
		});
	}
});

/**
 * 随机6位验证码
 */
function randomCode() {
	return Math.random().toString().slice(-6);
}
/**
 * 回复文字消息封装
 */
function sendTextMsg(toUser, fromUser, content) {
	let resultXml =
		'<xml><ToUserName><![CDATA[' + fromUser + ']]></ToUserName>';
	resultXml += '<FromUserName><![CDATA[' + toUser + ']]></FromUserName>';
	resultXml += '<CreateTime>' + new Date().getTime() + '</CreateTime>';
	resultXml += '<MsgType><![CDATA[text]]></MsgType>';
	resultXml += '<Content><![CDATA[' + content + ']]></Content></xml>';
	return resultXml;
}

export default router;
