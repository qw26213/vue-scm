<template>
  <div>
    <el-form ref="reqFrom" :model="reqFrom" :rules="rules" inline class="login-form" autocomplete="on" label-position="right" label-width="108px" style="width:685px;margin: 100px auto 0">
      <div class="title-container" style="margin-bottom:30px">
        <h3 class="title">企业注册</h3>
      </div>
      <p class="tit">企业信息：</p>
      <el-form-item label="企业全称" prop="orgName">
        <el-input v-model="reqFrom.orgName" placeholder="企业全称" />
      </el-form-item>
      <el-form-item label="企业联系人" prop="contactName">
        <el-input v-model="reqFrom.contactName" placeholder="企业联系人" />
      </el-form-item>
      <el-form-item label="企业所在地" prop="areaId">
        <el-select v-model="reqFrom.areaId" style="width:185px" placeholder="企业所在地" class="filter-item">
          <el-option v-for="item in areaList" :key="item.id" :label="item.areaName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="详细地址" prop="invoiceAddr">
        <el-input v-model="reqFrom.invoiceAddr" placeholder="详细地址" />
      </el-form-item>
      <el-form-item label="纳税类型" prop="taxFilingCategoryId">
        <el-select v-model="reqFrom.taxFilingCategoryId" placeholder="纳税类型" style="width:185px" class="filter-item">
          <el-option v-for="item in taxList" :key="item.id" :label="item.taxFilingCategoryName" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="纳税人识别号" prop="taxRegistrationCertificateNo">
        <el-input v-model="reqFrom.taxRegistrationCertificateNo" placeholder="纳税人识别号" />
      </el-form-item>
      <p class="tit">管理员信息：</p>
      <el-form-item label="用户账号" prop="userAccount">
        <el-input v-model="reqFrom.userAccount" placeholder="用户账号" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="userName">
        <el-input v-model="reqFrom.userName" placeholder="用户姓名" />
      </el-form-item>
      <el-form-item label="注册手机号" prop="mobile">
        <el-input v-model="reqFrom.mobile" placeholder="注册手机号" />
      </el-form-item>
      <el-form-item label="注册邮箱" prop="mail">
        <el-input v-model="reqFrom.mail" placeholder="注册邮箱" />
      </el-form-item>
      <el-form-item label="登录密码" prop="password">
        <el-input v-model="reqFrom.password" type="password" placeholder="登录密码" />
      </el-form-item>
      <el-form-item label="确认登录密码" prop="againPassword">
        <el-input v-model="reqFrom.againPassword" type="password" placeholder="确认登录密码" />
      </el-form-item>
      <el-form-item label="审核人签名" prop="sign2">
        <el-input v-model="reqFrom.sign2" placeholder="审核人签名" />
      </el-form-item>
      <div class="bot clearfix">
        <el-checkbox v-model="isRemember" style="float:left;margin-right:5px" />
        <span style="float:left">同意<a href="javascript:" style="color:#409EFF" @click="dialogVisible = true">《用户注册协议》</a></span>
        <span class="fr" @click="toPath('/login')">返回用户登录</span>
      </div>
      <el-button :loading="loading" type="primary" style="width:100%;margin:5px auto;" @click="handleRegister">确认注册</el-button>
    </el-form>
    <el-dialog title="金账簿用户注册协议" :visible.sync="dialogVisible" width="960px" top="5%">
      <div class="ptb15 plr15 agreement" style="height:600px;overflow:auto">
        <p style="font-weight:bold;">一、协议的接受</p>
        <p>1、在使用金账簿网站服务（以下简称“本网站”）之前，您应当认真阅读并遵守《金账簿服务协议》（以下简称“本协议”），请您务必审慎阅读、充分理解各条款内容，特别是免除或者限制责任的条款、争议解决和法律适用条款。如您对协议有任何疑问的，应向金账簿客服咨询。</p>
        <p>2、本协议中，“用户”指能够接受本协议，在金账簿网站合法注册并通过金账簿网站使用金账簿服务的使用者；“服务”指本网站提供的所有相关服务。</p>
        <p>3、当您以其他金账簿允许的方式实际使用金账簿网站服务时，也要完成注册程序（包括自动注册），即表示您已充分阅读、理解并接受本协议的全部内容。您可以使用通过本网站注册的企业代码和用户账号或者金账簿允许的其它方式登录金账簿网站。</p>
        <p>如果您不同意本协议的相关条款，请您立即停止使用本网站及其服务。</p>
        <p>4、本协议由您与金账簿软件的经营者共同缔结，本协议具有合同效力。</p>
        <p>5、您承诺接受并遵守本协议的约定，届时您不应以未阅读本协议的内容或者未获得金账簿对您问询的解答等理由，主张本协议无效，或要求撤销本协议。</p>
        <p>6、本协议内容包括协议正文、法律声明及所有金账簿已经发布或将来可能发布的各类规则、公告或通知（以下合称“金账簿规则”或“规则”）。所有规则为本协议不可分割的组成部分，与协议正文具有同等法律效力。为更好地为您服务，我们将更新本协议，相关通知，将在网站上公示，请您留意本网站的通知。</p>
        <p>7、金账簿有权根据业务需要酌情修订条款，并在本网站以公告的形式进行更新，不再单独通知予您。经修订的条款一经在本网站上公布，即产生效力。如您不同意相关修订，请您立即停止使用服务。如您继续使用服务，则将视为您已接受经修订的条款，当您与金账簿和/或其关联企业发生争议时，应以最新的条款为准。</p>
        <p style="font-weight:bold;">二、注册及用户管理</p>
        <p>1、您确认，在您完成注册程序时，您应当是具备完全民事行为的自然人、企业或其他组织。如您代表一家公司或其他法律主体进行注册或以其他金账簿允许的方式实际使用本服务，则您声明和保证，您有权使该公司或该法律主体受本协议“条款“的约束。</p>
        <p>2、您可以使用您提供或确认的手机号或者金账簿允许的其它方式作为用户账号进行注册。您承诺不得冒充他人进行注册，不得未经许可为他人注册，不得以可能导致其他用户误认的方式注册账号，不得使用可能侵犯他人权益的用户账号进行注册（包括但不限于涉嫌商标权、名誉权侵权等），否则金账簿有权取消该账号。</p>
        <p>3、您了解并同意，金账簿注册账号所有权归属于金账簿，注册完成后，您仅获得账号使用权。金账簿账号使用权仅归属于初始申请注册人及其绑定人员，不得以任何方式转让或被提供给他人使用，否则，金账簿有权立即不经通知收回该账号。因账号收回造成的该账号全部数据、信息等被清空、丢失等损失，您应自行承担。</p>
        <p>4、在您完成注册后，金账簿将根据账号和密码确认您的身份。您应妥善保管您的账户和密码，并对利用该账户和密码所进行的一切活动负全部责任。您承诺，在密码或账户遭到未获授权的使用，或者发生其他任何安全问题时，将立即通知金账簿，且您同意并确认，金账簿不对上述情形产生的任何直接或间接的遗失或损害承担责任。除非有法律规定或司法裁定，且征得金账簿的同意，否则，您的账户、密码不得以任何方式转让、赠与或继承（与账户相关的财产权益除外）。</p>
        <p style="font-weight:bold;">5、您了解并同意，在订购的服务到期后未续费，金账簿将停止提供原订购的服务，直到您续费为止，因为未及时续费而导致服务中断进而造成的相关问题及责任均由您自行承担。</p>
        <p style="font-weight:bold;">6、您了解并同意，在订购的服务到期后叁个月未续费，金账簿为系统优化管理之目的有权收回该账号，相关问题及责任均由您自行承担。</p>
        <p style="font-weight:bold;">7、金账簿根据本协议收回或取消账号后，有权自行对账号相关内容及信息以包括但不限于删除等方式进行处理，且无需就此向用户承担任何责任。</p>
        <p style="font-weight:bold;">三、隐私政策</p>
        <p>1、您在金账簿服务注册的账户具有密码保护功能，以确保您基本信息资料的安全，请您妥善保管账户及密码信息。</p>
        <p>2、金账簿努力采取各种合理的物理、电子和管理方面的安全措施来保护您的信息，使您存储在金账簿中的信息不会被泄漏、毁损或者丢失，包括但不限于SSL、信息加密存储、数据中心的访问控制。我们对可能接触到信息的员工也采取了严格管理，包括但不限于根据岗位的不同采取不同的权限控制，与他们签署保密协议，监控他们的操作情况等措施。金账簿会按现有技术提供相应的安全措施来保护您的信息，提供合理的安全保障，金账簿将在任何时候尽力做到使您的信息不被泄漏、毁损或丢失，但同时也请您注意在信息网络上不存在绝对完善的安全措施，请妥善保管好相关信息。</p>
        <p>3、金账簿有权根据实际情况自行决定您在本软件及服务中数据的最长储存期限、服务器中数据的最大存储空间等，您应当保管好终端、账号及密码，并妥善保管相关信息和内容，金账簿对您自身原因导致的数据丢失或被盗以及在本软件及服务中相关数据的删除或储存失败不承担责任。</p>
        <p style="font-weight:bold;">四、服务使用规范</p>
        <p>1、不得注册恶意的用户账号或利用本网站账号进行违法活动，以及干扰、欺骗、损坏本网站和其他网站，以及网站用户。</p>
        <p>2、不得利用本网站上传违反法律、行政法规、互联网管理方面的部门规章之内容，包括但不限于：宣传暴力、色情、破坏民族团结、侮辱、诽谤他人之内容。</p>
        <p>3、不得在本网站内容或您上传的资料中安装插件或软件，以上传、链接、跳转、推广非本网站授权的资料。</p>
        <p>4、不得对金账簿网站上的任何数据作商业性利用，包括但不限于在未经金账簿事先书面同意的情况下，以复制、传播等任何方式使用金账簿网站站上展示的资料。</p>
        <p>5、不得利用本网站或对本网站进行传播病毒、进行黑客攻击、入侵计算机系统、窃取他人的账号及密码、侵犯他人商业秘密及其他知识产权之行为。不使用任何装置、软件或例行程序干预或试图干预金账簿网站的正常运作或活动。不得采取任何将导致不合理的庞大数据负载加诸金账簿网站网络设备的行动。</p>
        <p>6、不得实施侵犯本网站内容及计算机软件所涉及的知识产权之行为。</p>
        <p>7、不得将我们的服务标志、注册商标、文档及图片、计算机软件等从其原来的位置上移除或做任何修改。</p>
        <p>8、对于前述1至7条等违反国家法律、行政法规或本协议约定的行为，本网站有权在不通知您的情况下删除非法信息，并有权对您的账号进行关闭或注销，不再提供服务，且不退还您已经支付的所有费用；由此造成的一切损失，由您自行负责，本网站不承担任何法律责任。</p>
        <p>9、您如果违反1至7条款下的内容，产生任何法律后果的，您应以自己的名义独立承担所有的法律责任，并确保金账簿免于因此产生任何损失或增加费用。</p>
        <p>10、基于维护金账簿网站的秩序及广大用户安全的需要，金账簿有权在发生恶意欺骗、侵犯他人的合法权益等情形下，执行关闭、冻结账户、停止服务等措施。</p>
        <p>11、经国家行政或司法机关的生效法律文书确认您存在违法或侵权行为，或者金账簿根据自身的判断，认为您的行为涉嫌违反法律法规的规定或涉嫌违反本协议和/或规则的条款的，则金账簿有权在金账簿网站上公示您的该等涉嫌违法或违约行为及金账簿已对您采取的措施。</p>
        <p>12、对于您在金账簿网站上发布的涉嫌违法、涉嫌侵犯他人合法权利或违反本协议和/或规则的信息，金账簿有权不经通知您即予以删除，且按照规则的规定进行处罚。</p>
        <p>13、对于您违反本协议项下承诺，或您在金账簿网站上实施的行为，包括您未在金账簿网站上实施但已经对金账簿网站及其用户产生影响的行为，金账簿有权单方认定您行为的性质及是否构成对本协议和/或规则的违反，并根据单方认定结果适用规则予以处理或终止向您提供服务，且无须征得您的同意或提前通知予您。您应自行保存与您行为有关的全部证据，并应对无法提供充分证据承担不利后果。</p>
        <p>14、如您涉嫌违反有关法律或者本协议之规定，使金账簿遭受任何损失，或受到任何第三方的索赔，或受到任何行政管理部门的处罚，您应当赔偿金账簿因此遭受的损失和/或发生的费用，包括合理的律师费用。</p>
        <p style="font-weight:bold;">五、金账簿服务</p>
        <p>1、您实施的所有行为均应遵守国家法律、法规等规范性文件及金账簿网站各项规则的规定和要求，不得违背社会公共利益或公共道德，不得损害他人的合法权益，不得违反本协议及相关规则。</p>
        <p>2、用户同意接受本网站通过电子邮件、即时通信的客户端、网页或其他合法方式发送与服务相关的内容或其他相关信息。</p>
        <p>3、用户依本协议所取得的服务权利不可转让。本协议下的所有业务内容均需在服务期限内使用，服务期届满，即使用户续约，也不得累积使用。</p>
        <p>4、购买服务：用户应提供金账簿网站上相应服务所要求提供的真实、完整的资料，当为您提供服务的第三方向您进一步了解、问询相关情况时，用户必须要向服务第三方提供真实的信息、资料、情况、证据。</p>
        <p>5、本网站上的文档仅为通用模板，用户下载后，依据自身需要进行的更改、具体化，是对文档的修改行为，对用户使用修改后的文档之行为的后果，本网站不承担任何法律责任。</p>
        <p>6、本网站与一定数量的第三方进行合作，对于本网站与第三方网站的链接、以及第三方网站提供的服务、您访问该第三方网站时的交易账号及密码安全问题，本网站不承担任何法律责任。</p>
        <p>7、您在使用金账簿网站服务过程中，所产生的应纳税赋，以及一切硬件、软件、服务及其它方面的费用，均由您独自承担。</p>
        <p style="font-weight:bold;">六、协议终止</p>
        <p>1、您同意，在法律允许的范围内，如发生下列任何一种情形，金账簿有权自行全权决定以任何理由不经事先通知的中止、终止向您提供部分或全部金账簿网站服务，暂时冻结或永久冻结（注销）您的账户在金账簿网站的权限，且无须为此向您或任何第三方承担任何责任。</p>
        <p>1）受到计算机病毒、木马或其他恶意程序、黑客攻击的破坏；</p>
        <p>2）您或金账簿的电脑软件、系统、硬件和通信线路出现故障；</p>
        <p>3）违反相关法律法规或本协议的约定；</p>
        <p>4）您通过非金账簿授权的方式使用本服务；</p>
        <p>5）根据法律规定您应提交真实信息，而您提供的个人资料不真实、或与注册时信息不一致又未能提供合理证明；</p>
        <p>6）按照法律规定的要求；</p>
        <p>7）出于安全的原因或其他必要的情形；</p>
        <p>8）其他金账簿无法控制或合理预见的情形。</p>
        <p>2、出现以下情况时，金账簿有权直接以注销账户的方式终止本协议，并有权永久冻结（注销）您的账户在金账簿网站的权限和收回账户对应的金账簿昵称：</p>
        <p>1)金账簿终止向您提供服务后，您涉嫌再一次直接或间接以他人名义注册为金账簿用户的；</p>
        <p>2)您提供的电子邮箱不存在或无法接收电子邮件，且没有其他方式可以与您进行联系，或金账簿以其它联系方式通知您更改电子邮件信息，而您在金账簿通知后三个工作日内仍未更改为有效的电子邮箱的；</p>
        <p>3)您提供的用户信息中的主要内容不真实或不准确或不及时或不完整；</p>
        <p>4)本协议（含规则）变更时，您明示并通知金账簿不愿接受新的服务协议的；</p>
        <p>5)其它金账簿认为应当终止服务的情况。</p>
        <p>3、您的账户服务被终止或者账户在金账簿网站的权限被永久冻结（注销）后，金账簿没有义务为您保留或向您披露您账户中的任何信息，也没有义务向您或第三方转发任何您未曾阅读或发送过的信息。</p>
        <p>4、您同意，您与金账簿的合同关系终止后，金账簿仍享有下列权利：</p>
        <p>1）继续保存您的用户信息及您使用金账簿网站服务期间的所有相关信息；</p>
        <p>2)您在使用金账簿网站服务期间存在违法行为或违反本协议和/或规则的行为的，金账簿仍可依据本协议向您主张权利。</p>
        <p>5、金账簿中止或终止向您提供金账簿网站服务后，对于您在服务中止或终止之前的行为依下列原则处理，您应独力处理并完全承担进行以下处理所产生的任何争议、损失或增加的任何费用，并应确保金账簿免于因此产生任何损失或承担任何费用：</p>
        <p>1)您在服务中止或终止之前已经上传至金账簿网站的服务尚未完成的，金账簿有权在中止或终止服务的同时删除相关信息；</p>
        <p>2)您在服务中止或终止之前已经与其他第三方达成买卖合同且已部分履行的，金账簿可以不删除该项服务内容，但金账簿有权在中止或终止服务的同时将相关情形通知您的服务方。</p>
        <p style="font-weight:bold;">七、免责声明</p>
        <p>1、为防止黑客攻击和计算机病毒入侵，我们将采取措施，包括使用当下的防护措施，来保护用户的注册信息和账号之安全，以及本网站的安全。但我们不能担保您的账户和密码以及本网站一定免受攻击。因此而导致的不能正常使用，本网站免责。</p>
        <p>2、非本网站所控制的通信线á故障导致的您不能使用本网站而造成的损失，本网站不承担任何法律责任。</p>
        <p>3、因本网站的技术故障等不可预测事件影响到服务的正常运行的，本网站承诺在第一时间与相关单位协调，及时处理进行修复；但是，您因此而遭受的一切损失，本网站免责。</p>
        <p>4、您在向本网站输入文件时，应事先做好备份，因信息丢失使您遭受损失的，本网站免责。</p>
        <p>5、因政府或司法行为导致您不能使用本网站的，本网站免责。</p>
        <p>6、本网站及本网站的雇员没有违反对您的法定义务情况下，造成您的损失，本网站免责。</p>
        <p>7、金账簿负责按"现状"和"可得到"的状态向您提供金账簿网站服务。但金账簿对金账簿网站服务不作任何明示或暗示的保证，包括但不限于金账簿网站服务的适用性、没有错误或疏漏、持续性、准确性、可靠性、适用于某一特定用途。同时，金账簿也不对金账簿网站服务所涉及的技术及信息的有效性、准确性、正确性、可靠性、质量、稳定、完整和及时性作出任何承诺和保证。</p>
        <p>8、不论在何种情况下，金账簿均不对由于信息网络正常的设备维护，信息网络连接故障，电脑、通讯或其他系统的故障，电力故障，罢工，劳动争议，暴乱，起义，骚乱，生产力或生产资料不足，火灾，洪水，风暴，爆炸，战争，政府行为，司法行政机关的命令或第三方的不作为而造成的不能服务或延迟服务承担责任。</p>
        <p style="font-weight:bold;">八、知识产权声明</p>
        <p>1、您了解及同意，除非金账簿另行声明，本协议项下服务包含的所有产品、技术、软件、程序、数据及其他信息（包括但不限于文字、图像、图片、照片、音频、视频、图表、色彩、版面设计、电子文档）的所有知识产权（包括但不限于版权、商标权、专利权、商业秘密等）及相关权利均归金账簿所有。</p>
        <p>2、您应保证，除非取得金账簿书面授权，对于上述权利您不得（并不得允许任何第三人）实施包括但不限于出租、出借、出售、散布、复制、修改、转载、汇编、发表、出版、还原工程、反向汇编、反向编译，或以其它方式发现原始码等的行为。</p>
        <p>3、金账簿涉及的Logo、“金账簿”等文字、图形及其组成，以及金账簿其他标识、徵记、产品和服务名称均为金账簿在中国和其它国家的商标，用户未经金账簿书面授权不得以任何方式展示、使用或作其他处理，也不得向他人表明您有权展示、使用、或作其他处理。</p>
        <p style="font-weight:bold;">九、通知送达</p>
        <p>本协议项下本网站对于用户所有的通知均可通过网页公告、电子邮件、手机短信或常规的信函传送等方式进行；该通知于发送之日视为已送达收件人。</p>
        <p style="font-weight:bold;">十、本协议的效力</p>
        <p>本协议中的任何条款无效不影响本协议的其余条款的法律效力。</p>
        <p style="font-weight:bold;">十一、 法律适用、管辖与其他</p>
        <p>1、本协议之效力、解释、变更、执行与争议解决均适用中华人民共和国大陆地区法律，如无相关法律规定的，则应参照通用国际商业惯例和/或行业惯例。</p>
        <p>2、本协议包含了您使用金账簿网站需遵守的一般性规范，您在使用某个金账簿网站时还需遵守适用于该网站的特殊性规范（具体请参见您与该网站签署的其他协议以及网站规则等内容）。一般性规范如与特殊性规范不一致或有冲突，则特殊性规范具有优先效力。</p>
        <p>3、因本协议产生之争议需根据您使用的服务归属的网站确定具体的争议对象，例如因您使用金账簿服务所产生的争议应由金账簿的经营者与您沟通并处理。一旦产生争议，您与金账簿网站的经营者均同意以经营者所在地人民法院为第一审管辖法院。</p>
        <p>4、如本协议的中文版本和英文版本内容产生冲突，或有其他语言版本，将以中文版本内容为准。本协议以中文版本为最终生效版本。</p>
        <p style="font-weight:bold;">附：产品费用条款</p>
        <p>1、 金账簿的服务是以收费方式提供的，如您使用收费服务，请遵守本产品费用条款。</p>
        <p>2、 金账簿可能根据实际需要对收费服务的收费标准、方式进行修改和变更。前述修改、变更前，金账簿将在相应服务页面进行通知或公告。如果您不同意上述修改、变更或付费内容，则应停止使用该服务。</p>
        <p style="font-weight:bold;">3、 鉴于本服务的特殊性，在您续费继续订购服务时，新订购的服务起始日期是从上个服务终止日的次日开始计算，而不是从您的订购日期或者支付日期开始计算。</p>
        <p>4、 除非另行约定，否则服务的规定价格不包括所有适用税款和货币结汇。您自行负责支付这种税费或其他费用。如果金账簿未准时从您处收到所有款项，那么金账簿可能会暂停或取消服务。因未付款而暂停或取消服务可能会造成您无法访问和使用自己的账户及其内容。</p>
        <p>5、 如果服务不包括Internet访问，那么您负责向您的Internet访问服务提供商支付相应费用。这些费用并不包含在您向金账簿支付的服务费用之中。如果您通过无线设备（例如，移动电话和平板电脑）来访问服务，则您的无线运营商可能会针对Web浏览、消息传递以及其他需要使用空中和无线数据服务的服务收取费用。请向您的运营商核实是否会向您收取这种费用。您应独自负责承担因通过任何无线或其他通信服务访问该服务而发生的任何费用。</p>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="primary" size="small" @click="dialogVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { registerLoadTaxfilingcategory, registerLoadArea, register } from '@/api/login'
import { getIndexInfo } from '@/api/user'
import { setToken } from '@/utils/auth'
import Cookies from 'js-cookie'
export default {
  name: 'Register',
  data() {
    const validateOrcode = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('企业代码至少6位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码至少6位'))
      } else {
        callback()
      }
    }
    return {
      loginUrl: '',
      taxList: [],
      dialogVisible: false,
      areaList: [],
      reqFrom: {
        orgName: '',
        userAccount: '',
        password: '',
        againPassword: '',
        taxRegistrationCertificateNo: '',
        invoiceAddr: '',
        taxFilingCategoryId: '',
        sign2: '',
        mail: '',
        mobile: '',
        contactName: '',
        userName: '',
        areaId: ''
      },
      isRemember: false,
      rules: {
        orgCode: [{ required: true, trigger: 'change', validator: validateOrcode }],
        userAccount: [{ required: true, message: '用户账号不能为空', trigger: 'change' }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        againPassword: [{ required: true, trigger: 'change', validator: validatePassword }],
        orgName: [{ required: true, trigger: 'change', message: '企业名称不能为空' }],
        userName: [{ required: true, trigger: 'change', message: '用户姓名不能为空' }],
        areaId: [{ required: true, trigger: 'change', message: '企业所在地不能为空' }],
        mobile: [{ required: true, trigger: 'change', message: '注册手机号不能为空' }],
        mail: [{ required: true, trigger: 'change', message: '注册邮箱不能为空' }],
        contactName: [{ required: true, trigger: 'change', message: '企业联系人不能为空' }],
        taxFilingCategoryId: [{ required: true, trigger: 'change', message: '纳税类型不能为空' }]
      },
      loading: false,
      redirect: this.$route.query.redirect
    }
  },
  created() {
    this.getData()
  },
  methods: {
    toPath(path) {
      this.$router.push({ path: path })
    },
    getData() {
      registerLoadTaxfilingcategory().then(res => {
        this.taxList = res.data.data
      })
      registerLoadArea().then(res => {
        this.areaList = res.data.data
      })
    },
    next(info) {
      this.$confirm(info, '提示', {
        confirmButtonText: '确定',
        closeOnClickModal: false,
        cancelButtonText: '取消',
        type: 'success',
        showCancelButton: false,
        showClose: false,
        dangerouslyUseHTMLString: true
      }).then(res => {
        setToken('111111')
        getIndexInfo(this.loginForm).then(res => {
          var user = res.data.data.userInfo
          sessionStorage.userInfo = JSON.stringify(user)
          Cookies.set('userName', user.userName)
          sessionStorage.bookId = user.bookId
          sessionStorage.taxFilingCategoryCode = user.taxFilingCategoryCode
          this.$router.push('/home')
        }).catch(err => {
          console.log(err)
        })
      })
    },
    handleRegister() {
      if (this.isRemember === false) {
        this.$message.warning('请仔细阅读并同意《用户服务协议》!')
        return
      }
      this.$refs.reqFrom.validate(valid => {
        if (valid) {
          this.loading = true
          register(this.reqFrom).then((res) => {
            this.loading = false
            if (res.data.errorCode === '0') {
              if (res.data == null || res.data === '') {
                this.next(res.data.msg)
              } else {
                this.next(res.data.msg)
              }
            } else {
              this.$message.warning(res.data.msg)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.agreement p {
    line-height: 24px;
    font-size: 13px;
    margin-top: 0;
    margin-bottom: 5px
}
</style>
