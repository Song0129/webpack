/**
 * 获取密码配置信息
 * @str  输入的密码
 * @userInfo  用户相关信息
 * @notSupportStr  不支持的字符
 * @continuousNum  连续递增、递减、重复的限制位数
 * @limitWord  不支持的其它字符
 * @author Joshua 2020/8/12
 */
window.checkPwd = (str='',userInfo={account: '',tel: '',mail: '',name: ''},rule,type)=> {
    // str = 'Asuiruiroot9+'
    console.log(str,userInfo,rule,type)
    $('.step2').css('paddingTop','0')
    $('#tip5').css('bottom','-15px')
    $('#confirmPwd').css('marginTop','0')
    if (!str){
        $('#errorMsg').text('请输入密码。');
        $('#tip5').text('请输入密码。');
        return false
    } else {
        $('#errorMsg').text('')
        $('#tip5').text('')
    }
    if ( !rule || rule == null || rule == {}) {
        $('#errorMsg').text('密码规则不存在，请联系管理员或刷新后重试');
        $('#tip5').text('密码规则不存在，请联系管理员或刷新后重试');
        return false
    }else {
        $('#errorMsg').text('')
        $('#tip5').text('')
    }

    if (!str.length) return;
    // 验证密码格式
    let formatCheckArr = rule.formatCheck.split('');
    let bigLettersCheck,smallLettersCheck,pwdNumberCheck,specialCharactersCheck;
    bigLettersCheck = smallLettersCheck = pwdNumberCheck = specialCharactersCheck = true;
    // 验证大写字母、小写字母、数字、特殊字符
    if (Number(formatCheckArr[0]) === 1) bigLettersCheck = formatCheck(str,'bigLetters');
    if (Number(formatCheckArr[1]) === 1) smallLettersCheck = formatCheck(str,'smallLetters');
    if (Number(formatCheckArr[2]) === 1) pwdNumberCheck = formatCheck(str,'pwdNumber');
    if (Number(formatCheckArr[3]) === 1) specialCharactersCheck = formatCheck(str,'specialCharacters');
    let formatCheckResult = {bigLettersCheck, smallLettersCheck, pwdNumberCheck, specialCharactersCheck}
    // 验证不支持输入的内容
    let inputCheckArr = rule.inputCheck.split('');
    let inputCheckAccount,inputCheckTel,inputCheckMail,inputCheckName;
    inputCheckAccount = inputCheckTel = inputCheckMail = inputCheckName = true;
    // 验证账号、邮箱、手机号、姓名
    if (Number(inputCheckArr[0]) === 1) inputCheckAccount = wordCheck(str,userInfo.account);
    if (Number(inputCheckArr[1]) === 1) inputCheckMail = wordCheck(str,userInfo.mail);
    if (Number(inputCheckArr[2]) === 1) inputCheckTel = wordCheck(str,userInfo.tel);
    if (Number(inputCheckArr[3]) === 1) inputCheckName = wordCheck(str,userInfo.name);
    let inputCheckResult = {inputCheckAccount,inputCheckTel,inputCheckMail,inputCheckName};

    // 验证不支持大小写转换
    let caseSensitiveCheckAccount,caseSensitiveCheckTel,caseSensitiveCheckMail,caseSensitiveCheckName;
    caseSensitiveCheckAccount = caseSensitiveCheckTel = caseSensitiveCheckMail = caseSensitiveCheckName = true;
    if (Number(rule.caseSensitive) === 1) {
        caseSensitiveCheckAccount = caseSensitiveCheck(str,userInfo.account);
        caseSensitiveCheckTel = caseSensitiveCheck(str,userInfo.tel);
        caseSensitiveCheckMail = caseSensitiveCheck(str,userInfo.mail);
        caseSensitiveCheckName = caseSensitiveCheck(str,userInfo.name);
    }
    let caseSensitiveCheckResult = {caseSensitiveCheckAccount,caseSensitiveCheckTel,caseSensitiveCheckMail,caseSensitiveCheckName};

    // 验证不支持连续递增、递减
    let continuousCheckResult = true;
    if (Number(rule.continuous) === 1) continuousCheckResult = continuousCheck(str,rule.continuousNum);

    // 验证重复
    let repeatCheckResult = true;
    if (Number(rule.continuous) === 1) repeatCheckResult = repeatCheck(str,rule.continuousNum);

    // 验证其他内容
    let otherResult = {};
    let otherArr = rule.others.split(',');
    otherArr = otherArr.filter(item=>item !== '');
    otherArr.forEach((item,index)=>{
        otherResult[item] = wordCheck(str,item);
    })


    let checkResult = {
        formatCheckResult,
        inputCheckResult,
        caseSensitiveCheckResult,
        continuousCheckResult,
        repeatCheckResult,
        otherResult
    }
    // console.log(checkResult)
    let s= errorTip(str,checkResult)

    if ( s === undefined){
        // console.log('提交')
        $('#errorMsg').html('')
        if ($('#rePwd').val()){
            $(".step2 .button").removeClass("disabled")
        }

        return true;
    } else {
        // console.log('有错')
        $(".step2 .button").removeClass("disabled").addClass("disabled")
        return false;
    }
}
// 所有的提示信息
window.errorTip = (str,checkResult)=> {
    $('.step2').css('paddingTop','0')
    // 长度、密码格式 提示函数
    let formatCheckArr = rule.formatCheck.split('');
    // 长度范围、密码格式提示
    let formatTip = `请输入${rule.minLength}-${rule.maxLength}位，包含`;
    let formatType = [];
    // 验证大写字母、小写字母、数字、特殊字符
    if (Number(formatCheckArr[0]) === 1) formatType.push('大写字母');
    if (Number(formatCheckArr[1]) === 1) formatType.push('小写字母');
    if (Number(formatCheckArr[2]) === 1) formatType.push('数字');
    if (Number(formatCheckArr[3]) === 1) formatType.push('特殊字符');
    formatType.forEach((item,index)=>{
        if (index !== (formatType.length - 1)){
            formatTip += `${item}、`;
        }else {
            formatTip += `${item}的密码`;
        }
    })
    // 长度限制 提示
    if (str.length > rule.maxLength || str.length < rule.minLength) {
        let a = document.createElement('span')
        $('#errorMsg').append(a)
        $('#errorMsg span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
        $('#errorMsg span').text(formatTip);
        if ($('#errorMsg span').width()==$('#errorMsg').width()){
            $('.step2').css('paddingTop','6px')
        }

        $('#tip5').append(a)
        $('#tip5 span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
        $('#tip5 span').text(formatTip);
        if ($('#tip5 span').width() > 305){
            $('#tip5').css('bottom','-36px')
            $('#confirmPwd').css('marginTop','20px')
        }

        return false;
    }else {
        $('#errorMsg').html('')
        $('#tip5').html('')
        $('.step2').css('paddingTop','0')
        $('#tip5').css('bottom','-15px')
        $('#confirmPwd').css('marginTop','0')
    }


    // 不包含密码格式 提示
    for (const s in checkResult.formatCheckResult) {
        if (!checkResult.formatCheckResult[s]){
            let a = document.createElement('span')
            $('#errorMsg').append(a)
            $('#errorMsg span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#errorMsg span').text(formatTip);
            if ($('#errorMsg span').width()==$('#errorMsg').width()){
                $('.step2').css('paddingTop','6px')
            }
            $('#tip5').append(a)
            $('#tip5 span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#tip5 span').text(formatTip);
            if ($('#tip5 span').width() > 305){
                $('#tip5').css('bottom','-36px')
                $('#confirmPwd').css('marginTop','20px')
            }
            return false;
        }else {
            $('#errorMsg').html('')
            $('#tip5').html('')
            $('.step2').css('paddingTop','0')
            $('#tip5').css('bottom','-15px')
            $('#confirmPwd').css('marginTop','0')
        }
    }



    // 其他内容不满足时 提示
    let otherTip = '密码不能包含';
    let otherType = [];
    for (const s in checkResult.otherResult) {
        if (!checkResult.otherResult[s]){
            otherType.push(s)
        }
    }
    otherType.forEach((item,index)=>{
        if (index !== (otherType.length - 1)){
            otherTip += `${item}、`;
        }else {
            otherTip += `${item}`;
        }
    })
    if (otherType.length > 0) {
        $('#errorMsg').text(otherTip);
        $('#tip5').text(otherTip);
        return false;
    }else {
        $('#errorMsg').text('')
        $('#tip5').text('')
    }

    // 不包含账号、邮箱、手机号、姓名
    let inputCheckArr = rule.inputCheck.split('');
    let inputTip = '密码不能包含';
    let inputType = [];
    // 验证账号、邮箱、手机号、姓名
    if (Number(inputCheckArr[0]) === 1) inputType.push('账号');
    if (Number(inputCheckArr[1]) === 1) inputType.push('邮箱');
    if (Number(inputCheckArr[2]) === 1) inputType.push('手机号');
    if (Number(inputCheckArr[3]) === 1) inputType.push('姓名');
    inputType.forEach((item,index)=>{
        if (index !== (inputType.length - 1)){
            inputTip += `${item}、`;
        }else {
            inputTip += `${item}`;
        }
    })
    for (const s in checkResult.inputCheckResult) {
        if (!checkResult.inputCheckResult[s]){
            let a = document.createElement('span')
            $('#errorMsg').append(a)
            $('#errorMsg span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#errorMsg span').text(inputTip);
            if ($('#errorMsg span').width()==$('#errorMsg').width()){
                $('.step2').css('paddingTop','6px')
            }
            $('#tip5').append(a)
            $('#tip5 span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#tip5 span').text(inputTip);
            if ($('#tip5 span').width() > 305){
                $('#tip5').css('bottom','-36px')
                $('#confirmPwd').css('marginTop','20px')
            }
            return false;
        }else {
            $('#errorMsg').html('')
            $('#tip5').html('')
            $('.step2').css('paddingTop','0')
            $('#tip5').css('bottom','-15px')
            $('#confirmPwd').css('marginTop','0')
        }
    }

    // 密码不能包含账号、邮箱、姓名的大小写转换 提示
    for (const s in checkResult.caseSensitiveCheckResult) {
        if (!checkResult.caseSensitiveCheckResult[s]){
            let a = document.createElement('span')
            $('#errorMsg').append(a)
            $('#errorMsg span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#errorMsg span').text('密码不能包含账号、邮箱、姓名的大小写转换');
            if ($('#errorMsg span').width()==$('#errorMsg').width()){
                $('.step2').css('paddingTop','6px')
            }
            $('#tip5').append(a)
            $('#tip5 span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
            $('#tip5 span').text('密码不能包含账号、邮箱、姓名的大小写转换');
            if ($('#tip5 span').width() > 305){
                $('#tip5').css('bottom','-36px')
                $('#confirmPwd').css('marginTop','20px')
            }
            return false;
        } else {
            $('#errorMsg').html('')
            $('#tip5').html('')
            $('.step2').css('paddingTop','0')
            $('#tip5').css('bottom','-15px')
            $('#confirmPwd').css('marginTop','0')
        }
    }

    // 密码联系递增、递减、重复  提示
    if (!checkResult.repeatCheckResult || !checkResult.continuousCheckResult){
        let a = document.createElement('span')
        $('#errorMsg').append(a)
        $('#errorMsg span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
        $('#errorMsg span').text(`密码不能包含连续${rule.continuousNum}位及以上数字和字母递增、递减及重复`);
        if ($('#errorMsg span').width()==$('#errorMsg').width()){
            $('.step2').css('paddingTop','6px')
        }
        $('#tip5').append(a)
        $('#tip5 span').css({'display':'inline-block','color': 'red','line-height': '1.2'})
        $('#tip5 span').text(`密码不能包含连续${rule.continuousNum}位及以上数字和字母递增、递减及重复`);
        if ($('#tip5 span').width() > 305){
            $('#tip5').css('bottom','-36px')
            $('#confirmPwd').css('marginTop','20px')
        }
        return false;
    }else {
        $('#errorMsg').html('')
        $('#tip5').html('')
        $('.step2').css('paddingTop','0')
        $('#tip5').css('bottom','-15px')
        $('#confirmPwd').css('marginTop','0')
    }
}

// 验证密码格式
window.formatCheck = (str,type)=>{
    if (type === 'bigLetters') return /[A-Z]+/.test(str)
    if (type === 'smallLetters') return /[a-z]+/.test(str);
    if (type === 'pwdNumber') return /[0-9]+/.test(str);
    if (type === 'specialCharacters') return /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]+/.test(str);
}

// 验证不支持输入的内容  验证其他内容
window.wordCheck = (str,limitWord)=>{
    if (str.indexOf(limitWord)  !== -1 && limitWord !== ''){
        return false;
    } else {
        return true;
    }
}

// 验证不支持大小写转换
window.caseSensitiveCheck = (str,notSupportStr)=>{
    if (str.toUpperCase().indexOf(notSupportStr.toUpperCase())  !== -1 && notSupportStr !== ''){
        return false;
    } else {
        return true;
    }
}

// 验证不支持连续递增、递减
window.continuousCheck = (str,continuousNum)=>{
    let num = 1;
    let arr = str.split('');
    let arr1 = [1];
    for (let i = 1; i < arr.length; i++) {
        if (((arr[ i ].charCodeAt()) - (arr[ i - 1 ].charCodeAt()) === 1) ||
            ((arr[ i ].charCodeAt()) - (arr[ i - 1 ].charCodeAt()) === -1)) { //1正序连贯；-1倒序连贯
            if (arr[ i + 1 ] && (arr[ i + 1 ].charCodeAt() === arr[ i - 1 ].charCodeAt())){
                num += 1;
                arr1.push(num);
                num = 1;
            } else {
                num += 1;
                arr1.push(num);
            }
        } else {
            num = 1;
        }
    }
    return  Math.max(...arr1) < Number(continuousNum);
}

// 验证重复
window.repeatCheck = (str,continuousNum) =>{
    let num = 1;
    let arr = str.split('');
    let arr1 = [1];
    for (let i = 1; i < arr.length; i++) {
        if (arr[ i ].charCodeAt() === arr[ i - 1 ].charCodeAt()){
            num += 1;
            arr1.push(num);
        } else {
            num = 1;
        }
    }
    return  Math.max(...arr1) < Number(continuousNum);
}

window.getPwdPlaceholder = (rule)=> {
    if (!rule || rule == {} || rule == null) {
        $('#errorMsg').text('密码规则不存在，请联系管理员或刷新后重试');
        $('#tip5').text('密码规则不存在，请联系管理员或刷新后重试');
        return '请输入密码'
    }
    let formatCheckArr = rule.formatCheck.split('');
    let placeholder = '';
    placeholder += `${rule.minLength}-${rule.maxLength}位，`
    let placeholderType = [];
    // 验证大写字母、小写字母、数字、特殊字符
    if (Number(formatCheckArr[0]) === 1 && Number(formatCheckArr[1]) === 1) placeholderType.push('大、小写字母');
    if (Number(formatCheckArr[0]) === 1 && Number(formatCheckArr[1]) !== 1) placeholderType.push('大写字母');
    if (Number(formatCheckArr[1]) === 1 && Number(formatCheckArr[0]) !== 1) placeholderType.push('小写字母');
    if (Number(formatCheckArr[2]) === 1) placeholderType.push('数字');
    if (Number(formatCheckArr[3]) === 1) placeholderType.push('特殊字符');
    placeholderType.forEach((item,index)=>{
        if (placeholderType.length >= 2){
            if (index < (placeholderType.length - 2)){
                placeholder += `${item}、`;
            }else if (index === (placeholderType.length - 2)){
                placeholder += `${item}`;
            } else {
                placeholder += `和${item}`;
            }
        } else if (placeholderType.length === 1){
            placeholder += `${item}`;
        }

    })
    return placeholder
}

window.getMaxLength = (rule)=>{
    if (!rule || rule == {} || rule == null) {
        $('#errorMsg').text('密码规则不存在，请联系管理员或刷新后重试');
        $('#tip5').text('密码规则不存在，请联系管理员或刷新后重试');
        return 30;
    }
    return Number(rule.maxLength);
}

window.getTips = (rule)=> {
    if (!rule || rule == {} || rule == null) {
        $('#errorMsg').text('密码规则不存在，请联系管理员或刷新后重试');
        $('#tip5').text('密码规则不存在，请联系管理员或刷新后重试');
        return;
    }

    let tips = '';
    let tipsArr = [];

    // 第一条 提示  长度、密码格式
    let formatCheckArr = rule.formatCheck.split('');
    // 长度范围、密码格式提示
    let formatTip = `请输入${rule.minLength}-${rule.maxLength}位，包含`;
    let formatType = [];
    // 验证大写字母、小写字母、数字、特殊字符
    if (Number(formatCheckArr[0]) === 1 && Number(formatCheckArr[1]) === 1) formatType.push('大、小写字母');
    if (Number(formatCheckArr[0]) === 1 && Number(formatCheckArr[1]) !== 1) formatType.push('大写字母');
    if (Number(formatCheckArr[1]) === 1 && Number(formatCheckArr[0]) !== 1) formatType.push('小写字母');
    if (Number(formatCheckArr[2]) === 1) formatType.push('数字');
    if (Number(formatCheckArr[3]) === 1) formatType.push('特殊字符');
    formatType.forEach((item,index)=>{
        if (index !== (formatType.length - 1)){
            formatTip += `${item}、`;
        }else {
            formatTip += `${item}的密码`;
        }
    })
    tipsArr.push(formatTip);

    // 第二条  提示 不支持其他输入内容  自定义
    let otherArr = rule.others.split(',');
    let otherTip = '密码不能包含'
    otherArr = otherArr.filter(item=>item !== '');
    if (otherArr.length){
        otherArr.forEach((item,index)=>{
            if (index !== (otherArr.length - 1)){
                otherTip += `${item}、`;
            }else {
                otherTip += `${item}`;
            }
        })
        tipsArr.push(otherTip);
    }

    // 第三条  提示 不支持输入的内容  账号、邮箱、手机号、姓名
    let inputCheckArr = rule.inputCheck.split('');
    let inputCheckType = [];
    let inputCheckTip = '密码不能包含';
    if (Number(inputCheckArr[0]) === 1) inputCheckType.push('账号');
    if (Number(inputCheckArr[1]) === 1) inputCheckType.push('邮箱');
    if (Number(inputCheckArr[2]) === 1) inputCheckType.push('手机号');
    if (Number(inputCheckArr[3]) === 1) inputCheckType.push('姓名');
    if (inputCheckType.length){
        inputCheckType.forEach((item,index)=>{
            if (index !== (inputCheckType.length - 1)){
                inputCheckTip += `${item}、`;
            }else {
                inputCheckTip += `${item}`;
            }
        })
        tipsArr.push(inputCheckTip);
    }

    // 第四条  提示 不能包含账号、邮箱、姓名大小写转换
    let caseSensitiveTip = ''
    if (Number(rule.caseSensitive) === 1) {
        caseSensitiveTip += '密码不能包含账号、邮箱、姓名的大小写转换';
        tipsArr.push(caseSensitiveTip);
    }

    // 第五条  提示 不能包含连续X位以上的数字和字母的递增递减重复
    let continuousTip = ''
    if (Number(rule.continuous) === 1) {
        continuousTip = `密码不能包含连续${rule.continuousNum}位及以上数字和字母递增、递减及重复`;
        tipsArr.push(continuousTip);
    }

    // 汇总整理  抛出提示
    if (tipsArr.length){
        tipsArr.unshift('为保证账号安全，请遵循以下密码规则');
        tipsArr.forEach((item,index)=>{
            if (index === 0) {
                tips += `<div style="text-indent:-20px;margin-left:25px">${item}</div>`;
            } else {
                tips += `<div style="text-indent:-20px;margin-left:25px">${index}、${item}</div>`;
            }
        })
    }
    return tips;
}



