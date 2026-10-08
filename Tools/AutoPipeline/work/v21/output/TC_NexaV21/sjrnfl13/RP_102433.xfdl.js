(function()
{
    return function()
    {
        if (!this._is_form)
            return;
        
        var obj = null;
        
        this.on_create = function()
        {
            this.set_font("9pt/normal \"ＭＳ ゴシック\"");
            this.set_name("TSS11552_InputFilter_full_specialchar");
            this.set_titletext("New Form");
            if (Form == this.constructor)
            {
                this._setFormPosition(1280,720);
            }
            
            // Object(Dataset, ExcelExportObject) Initialize

            
            // UI Components Initialize
            obj = new Edit("Edit00","84","30","243","30",null,null,null,null,null,null,this);
            obj.set_inputtype("full");
            obj.set_taborder("0");
            this.addChild(obj.name, obj);

            obj = new TextArea("taCheckFull","84","65","236","145",null,null,null,null,null,null,this);
            obj.set_inputtype("full");
            obj.set_taborder("1");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00_00","347","30","243","30",null,null,null,null,null,null,this);
            obj.set_inputtype("english,number,sign,space,symbol");
            obj.set_taborder("2");
            this.addChild(obj.name, obj);

            obj = new TextArea("taCheckEnglishNumberSymbol","347","68","236","145",null,null,null,null,null,null,this);
            obj.set_inputtype("english,number,sign,space,symbol");
            obj.set_taborder("3");
            this.addChild(obj.name, obj);

            obj = new Static("Static00","75","-4","120","34",null,null,null,null,null,null,this);
            obj.set_taborder("4");
            obj.set_text("inputtype=full : ");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00","310","-4","275","34",null,null,null,null,null,null,this);
            obj.set_taborder("5");
            obj.set_text("inputtype=english,number,sign,space,symbol : ");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00_00_00","597","30","243","30",null,null,null,null,null,null,this);
            obj.set_inputtype("half");
            obj.set_taborder("6");
            this.addChild(obj.name, obj);

            obj = new TextArea("taCheckHalf","597","68","236","145",null,null,null,null,null,null,this);
            obj.set_inputtype("half");
            obj.set_taborder("7");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00","595","-4","185","34",null,null,null,null,null,null,this);
            obj.set_taborder("8");
            obj.set_text("inputtype=half : ");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit00_00_00_00","847","30","243","30",null,null,null,null,null,null,this);
            obj.set_inputtype("alpha");
            obj.set_taborder("9");
            this.addChild(obj.name, obj);

            obj = new TextArea("taCheckAlpha","847","68","236","145",null,null,null,null,null,null,this);
            obj.set_inputtype("alpha");
            obj.set_taborder("10");
            this.addChild(obj.name, obj);

            obj = new Static("Static00_00_00_00","845","-4","145","34",null,null,null,null,null,null,this);
            obj.set_taborder("11");
            obj.set_text("inputtype=alpha: ");
            this.addChild(obj.name, obj);

            obj = new TextArea("ta1Byte","25","272","245","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("12");
            obj.set_value("!\"#$%&\'()-=^~\\|\n,.<>/?_;:+*[]{}`@\nABCDEFGHIJKLMNOPQRSTUVWXYZ\nabcdefghijklmnopqrstuvwxyz\n0123456789\n ");
this.addChild(obj.name, obj);

            obj = new Static("lb1Byte","20","236","275","40",null,null,null,null,null,null,this);
            obj.set_taborder("13");
            obj.set_text("UTF-8 1byte(U+0000 - U+007F) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new Static("lb2Byte","280","236","230","40",null,null,null,null,null,null,this);
            obj.set_taborder("14");
            obj.set_text("UTF-8 2byte(U+0080 - U+07FF) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("ta2Byte","285","272","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("15");
            obj.set_value("¡¢£¤¥¦§¨©ª«¬®¯\n°±²³´µ¶·¸¹º»¼½¾¿\nÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏ\nÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞß\nàáâãäåæçèéêëìíîï\nðñòóôõö÷øùúûüýþÿ\nĀāĂăĄąĆćĈĉĊċČčĎď\nĐđĒēĔĕĖėĘęĚěĜĝĞğ\nĠġĢģĤĥĦħĨĩĪīĬĭĮį\nİıĲĳĴĵĶķĸĹĺĻļĽľĿ\nŀŁłŃńŅņŇňŉŊŋŌōŎŏ\nŐőŒœŔŕŖŗŘřŚśŜŝŞş\nŠšŢţŤťŦŧŨũŪūŬŭŮů\nŰűŲųŴŵŶŷŸŹźŻżŽžſ\nƀƁƂƃƄƅƆƇƈƉƊƋƌƍƎƏ\nƐƑƒƓƔƕƖƗƘƙƚƛƜƝƞƟ\nƠơƢƣƤƥƦƧƨƩƪƫƬƭƮƯ\nưƱƲƳƴƵƶƷƸƹƺƻƼƽƾƿ\nǀǁǂǃǄǅǆǇǈǉǊǋǌǍǎǏ\nǐǑǒǓǔǕǖǗǘǙǚǛǜǝǞǟ\nǠǡǢǣǤǥǦǧǨǩǪǫǬǭǮǯ\nǰǱǲǳǴǵǶǷǸǹǺǻǼǽǾǿ\nȀȁȂȃȄȅȆȇȈȉȊȋȌȍȎȏ\nȐȑȒȓȔȕȖȗȘșȚțȜȝȞȟ\nȠȡȢȣȤȥȦȧȨȩȪȫȬȭȮȯ\nȰȱȲȳȴȵȶȷȸȹȺȻȼȽȾȿ\nɀɁɂɃɄɅɆɇɈɉɊɋɌɍɎɏ\nɐɑɒɓɔɕɖɗɘəɚɛɜɝɞɟ\nɠɡɢɣɤɥɦɧɨɩɪɫɬɭɮɯ\nɰɱɲɳɴɵɶɷɸɹɺɻɼɽɾɿ\nʀʁʂʃʄʅʆʇʈʉʊʋʌʍʎʏ\nʐʑʒʓʔʕʖʗʘʙʚʛʜʝʞʟ\nʠʡʢʣʤʥʦʧʨʩʪʫʬʭʮʯ\nʰʱʲʳʴʵʶʷʸʹʺʻʼʽʾʿ\nˀˁ˂˃˄˅ˆˇˈˉˊˋˌˍˎˏ\nːˑ˒˓˔˕˖˗˘˙˚˛˜˝˞˟\nˠˡˢˣˤ˥˦˧˨˩˪˫ˬ˭ˮ˯\n˰˱˲˳˴˵˶˷˸˹˺˻˼˽˾˿\ǹ́̂̃̄̅̆̇̈̉̊̋̌̍̎̏\n̛̖̗̘̙̜̝̞̟̐̑̒̓̔̕̚\n̡̢̧̨̠̣̤̥̦̩̪̫̬̭̮̯\n̴̵̶̷̸̰̱̲̳̹̺̻̼̽̾̿\ǹ͇͈͉͍͎́͂̓̈́͆͊͋͌ͅ\n͓͔͕͖͙͚͐͑͒͗͛͘͜͟͝͞\nͣͤͥͦͧͨͩͪͫͬͭͮͯ͢͠͡\nͰͱͲͳʹ͵Ͷͷͺͻͼͽ;\n΄΅Ά·ΈΉΊΌΎΏ\nΐΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟ\nΠΡΣΤΥΦΧΨΩΪΫάέήί\nΰαβγδεζηθικλμνξο\nπρςστυφχψωϊϋόύώϏ\nϐϑϒϓϔϕϖϗϘϙϚϛϜϝϞϟ\nϠϡϢϣϤϥϦϧϨϩϪϫϬϭϮϯ\nϰϱϲϳϴϵ϶ϷϸϹϺϻϼϽϾϿ\nЀЁЂЃЄЅІЇЈЉЊЋЌЍЎЏ\nАБВГДЕЖЗИЙКЛМНОП\nРСТУФХЦЧШЩЪЫЬЭЮЯ\nабвгдежзийклмноп\nрстуфхцчшщъыьэюя\nѐёђѓєѕіїјљњћќѝўџ\nѠѡѢѣѤѥѦѧѨѩѪѫѬѭѮѯ\nѰѱѲѳѴѵѶѷѸѹѺѻѼѽѾѿ\nҀҁ҂҃҄҅҆҇҈҉ҊҋҌҍҎҏ\nҐґҒғҔҕҖҗҘҙҚқҜҝҞҟ\nҠҡҢңҤҥҦҧҨҩҪҫҬҭҮү\nҰұҲҳҴҵҶҷҸҹҺһҼҽҾҿ\nӀӁӂӃӄӅӆӇӈӉӊӋӌӍӎӏ\nӐӑӒӓӔӕӖӗӘәӚӛӜӝӞӟ\nӠӡӢӣӤӥӦӧӨөӪӫӬӭӮӯ\nӰӱӲӳӴӵӶӷӸӹӺӻӼӽӾӿ\nԀԁԂԃԄԅԆԇԈԉԊԋԌԍԎԏ\nԐԑԒԓԔԕԖԗԘԙԚԛԜԝԞԟ\nԠԡԢԣ\nԱԲԳԴԵԶԷԸԹԺԻԼԽԾԿ\nՀՁՂՃՄՅՆՇՈՉՊՋՌՍՎՏ\nՐՑՒՓՔՕՖՙ՚՛՜՝՞՟\nաբգդեզէըթժիլխծկ\nհձղճմյնշոչպջռսվտ\nրցւփքօֆև։֊\n֑֖֛֚֒֓֔֕֗֘֙֜֝֞֟\n֢֣֤֥֦֧֪֭֮֠֡֨֩֫֬֯\nְֱֲֳִֵֶַָֹֺֻּֽ־ֿ\n׀ׁׂ׃ׅׄ׆ׇ\nאבגדהוזחטיךכלםמן\nנסעףפץצקרשת\nװױײ׳״\n؀؁؂؃؆؇؈؉؊؋،؍؎؏\nؘؙؚؐؑؒؓؔؕؖؗ؛؞؟\nءآأؤإئابةتثجحخد\nذرزسشصضطظعغػؼؽؾؿ\nـفقكلمنهوىيًٌٍَُ\nِّْٕٖٜٓٔٗ٘ٙٚٛٝٞ\n٠١٢٣٤٥٦٧٨٩٪٫٬٭ٮٯ\nٰٱٲٳٴٵٶٷٸٹٺٻټٽپٿ\nڀځڂڃڄڅچڇڈډڊڋڌڍڎڏ\nڐڑڒړڔڕږڗژڙښڛڜڝڞڟ\nڠڡڢڣڤڥڦڧڨکڪګڬڭڮگ\nڰڱڲڳڴڵڶڷڸڹںڻڼڽھڿ\nۀہۂۃۄۅۆۇۈۉۊۋیۍێۏ\nېۑےۓ۔ەۖۗۘۙۚۛۜ۝۞۟\nۣ۠ۡۢۤۥۦۧۨ۩۪ۭ۫۬ۮۯ\n۰۱۲۳۴۵۶۷۸۹ۺۻۼ۽۾ۿ\n܀܁܂܃܄܅܆܇܈܉܊܋܌܍\nܐܑܒܓܔܕܖܗܘܙܚܛܜܝܞܟ\nܠܡܢܣܤܥܦܧܨܩܪܫܬܭܮܯ\nܱܴܷܸܹܻܼܾܰܲܳܵܶܺܽܿ\n݂݄݆݈݀݁݃݅݇݉݊ݍݎݏ\nݐݑݒݓݔݕݖݗݘݙݚݛݜݝݞݟ\nݠݡݢݣݤݥݦݧݨݩݪݫݬݭݮݯ\nݰݱݲݳݴݵݶݷݸݹݺݻݼݽݾݿ\nހށނރބޅކއވމފދތލގޏ\nސޑޒޓޔޕޖޗޘޙޚޛޜޝޞޟ\nޠޡޢޣޤޥަާިީުޫެޭޮޯ\nްޱ\n߀߁߂߃߄߅߆߇߈߉ߊߋߌߍߎߏ\nߐߑߒߓߔߕߖߗߘߙߚߛߜߝߞߟ\nߠߡߢߣߤߥߦߧߨߩߪ߫߬߭߮߯\n߲߰߱߳ߴߵ߶߷߸߹ߺ");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth","525","236","230","40",null,null,null,null,null,null,this);
            obj.set_taborder("16");
            obj.set_text("UTF-8 halfwidth(U+FF61 - U+FFDC; U+FFE8 -U+FFEE) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taHalfwidth","530","272","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("17");
            obj.set_value("｡｢｣､･ｦｧｨｩｪｫｬｭｮｯ\nｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ\nﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏ\nﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝﾞﾟ\nﾡﾢﾣﾤﾥﾦﾧﾨﾩﾪﾫﾬﾭﾮﾯ\nﾰﾱﾲﾳﾴﾵﾶﾷﾸﾹﾺﾻﾼﾽﾾ\nￂￃￄￅￆￇￊￋￌￍￎￏ\nￒￓￔￕￖￗￚￛￜ\n￨￩￪￫￬￭￮");
            this.addChild(obj.name, obj);

            obj = new Static("lbResultFull","85","211","234","24",null,null,null,null,null,null,this);
            obj.set_font("bold 12pt/normal \"Meiryo\",\"Verdana\",\"Roboto\",\"Droid Sans\",\"游ゴシック\",\"YuGothic\",\"ヒラギノ角ゴ ProN W3\",\"Hiragino Kaku Gothic ProN\",\"ＭＳ Ｐゴシック\",\"MS Gothic\",\"sans-serif\"");
            obj.set_taborder("18");
            obj.set_text("Result");
            this.addChild(obj.name, obj);

            obj = new Static("lbResultEnglishDigit","347","211","234","24",null,null,null,null,null,null,this);
            obj.set_font("bold 12pt/normal \"Meiryo\",\"Verdana\",\"Roboto\",\"Droid Sans\",\"游ゴシック\",\"YuGothic\",\"ヒラギノ角ゴ ProN W3\",\"Hiragino Kaku Gothic ProN\",\"ＭＳ Ｐゴシック\",\"MS Gothic\",\"sans-serif\"");
            obj.set_taborder("19");
            obj.set_text("Result");
            this.addChild(obj.name, obj);

            obj = new Static("lbResultHalfDigitSpace","597","211","234","24",null,null,null,null,null,null,this);
            obj.set_font("bold 12pt/normal \"Meiryo\",\"Verdana\",\"Roboto\",\"Droid Sans\",\"游ゴシック\",\"YuGothic\",\"ヒラギノ角ゴ ProN W3\",\"Hiragino Kaku Gothic ProN\",\"ＭＳ Ｐゴシック\",\"MS Gothic\",\"sans-serif\"");
            obj.set_taborder("20");
            obj.set_text("Result");
            this.addChild(obj.name, obj);

            obj = new Static("lbResultAlpha","847","211","234","24",null,null,null,null,null,null,this);
            obj.set_font("bold 12pt/normal \"Meiryo\",\"Verdana\",\"Roboto\",\"Droid Sans\",\"游ゴシック\",\"YuGothic\",\"ヒラギノ角ゴ ProN W3\",\"Hiragino Kaku Gothic ProN\",\"ＭＳ Ｐゴシック\",\"MS Gothic\",\"sans-serif\"");
            obj.set_taborder("21");
            obj.set_text("Result");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheck1Byte","26","426","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("22");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheck2Byte","286","426","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("23");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckHalfwidth","531","426","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("24");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Button("btnClear","10","30","60","205",null,null,null,null,null,null,this);
            obj.set_taborder("25");
            obj.set_text("Clear");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth00","765","236","240","40",null,null,null,null,null,null,this);
            obj.set_taborder("26");
            obj.set_text("UTF-8 HIRAGANA(U+3041 - U+309F) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taHiragana","770","272","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("27");
            obj.set_value("ぁあぃいぅうぇえぉおかがきぎく\nぐけげこごさざしじすずせぜそぞた\nだちぢっつづてでとどなにぬねのは\nばぱひびぴふぶぷへべぺほぼぽまみ\nむめもゃやゅゆょよらりるれろゎわ\nゐゑをんゔゕゖ゙゚゛゜ゝゞゟ");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckHiragana","770","426","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("28");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth00_00","1005","236","245","40",null,null,null,null,null,null,this);
            obj.set_taborder("29");
            obj.set_text("UTF-8 KATAKANA(U+30A0 - U+30FF) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taKatakana","1010","272","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("30");
            obj.set_value("゠ァアィイゥウェエォオカガキギク\nグケゲコゴサザシジスズセゼソゾタ\nダチヂッツヅテデトドナニヌネノハ\nバパヒビピフブプヘベペホボポマミ\nムメモャヤュユョヨラリルレロヮワ\nヰヱヲンヴヵヶヷヸヹヺ・ーヽヾヿ");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckKatakana","1010","426","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("31");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new TextArea("taEnclosedAlphanumerics","25","522","245","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("32");
            obj.set_value("①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯\n⑰⑱⑲⑳⑴⑵⑶⑷⑸⑹⑺⑻⑼⑽⑾⑿\n⒀⒁⒂⒃⒄⒅⒆⒇⒈⒉⒊⒋⒌⒍⒎⒏\n⒐⒑⒒⒓⒔⒕⒖⒗⒘⒙⒚⒛⒜⒝⒞⒟\n⒠⒡⒢⒣⒤⒥⒦⒧⒨⒩⒪⒫⒬⒭⒮⒯\n⒰⒱⒲⒳⒴⒵ⒶⒷⒸⒹⒺⒻⒼⒽⒾⒿ\nⓀⓁⓂⓃⓄⓅⓆⓇⓈⓉⓊⓋⓌⓍⓎⓏ\nⓐⓑⓒⓓⓔⓕⓖⓗⓘⓙⓚⓛⓜⓝⓞⓟ\nⓠⓡⓢⓣⓤⓥⓦⓧⓨⓩ⓪⓫⓬⓭⓮⓯\n⓰⓱⓲⓳⓴⓵⓶⓷⓸⓹⓺⓻⓼⓽⓾⓿");
            this.addChild(obj.name, obj);

            obj = new Static("lb1Byte00","20","486","255","40",null,null,null,null,null,null,this);
            obj.set_taborder("33");
            obj.set_text("Enclosed Alphanumerics(U+2460 - U+24FF) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new Static("lb2Byte00","280","486","230","40",null,null,null,null,null,null,this);
            obj.set_taborder("34");
            obj.set_text("Number Forms(U+2150 - U+218B) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taNumberForms","285","522","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("35");
            obj.set_value("⅐⅑⅒⅓⅔⅕⅖⅗⅘⅙⅚⅛⅜⅝⅞⅟\nⅠⅡⅢⅣⅤⅥⅦⅧⅨⅩⅪⅫⅬⅭⅮⅯ\nⅰⅱⅲⅳⅴⅵⅶⅷⅸⅹⅺⅻⅼⅽⅾⅿ\nↀↁↂↃↄↅↆↇↈ↉↊↋");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth01","525","486","230","40",null,null,null,null,null,null,this);
            obj.set_taborder("36");
            obj.set_text("Enclosed CJK Letters and Months(U+3200 - U+32FE) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taEnclosedCJKLettersMonths","530","522","230","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("37");
            obj.set_value("㈀㈁㈂㈃㈄㈅㈆㈇㈈㈉㈊㈋㈌㈍㈎㈏\n㈐㈑㈒㈓㈔㈕㈖㈗㈘㈙㈚㈛㈜㈝㈞\n㈠㈡㈢㈣㈤㈥㈦㈧㈨㈩㈪㈫㈬㈭㈮㈯\n㈰㈱㈲㈳㈴㈵㈶㈷㈸㈹㈺㈻㈼㈽㈾㈿\n㉀㉁㉂㉃㉄㉅㉆㉇㉈㉉㉊㉋㉌㉍㉎㉏\n㉐㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟\n㉠㉡㉢㉣㉤㉥㉦㉧㉨㉩㉪㉫㉬㉭㉮㉯\n㉰㉱㉲㉳㉴㉵㉶㉷㉸㉹㉺㉻㉼㉽㉾㉿\n㊀㊁㊂㊃㊄㊅㊆㊇㊈㊉㊊㊋㊌㊍㊎㊏\n㊐㊑㊒㊓㊔㊕㊖㊗㊘㊙㊚㊛㊜㊝㊞㊟\n㊠㊡㊢㊣㊤㊥㊦㊧㊨㊩㊪㊫㊬㊭㊮㊯\n㊰㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿\n㋀㋁㋂㋃㋄㋅㋆㋇㋈㋉㋊㋋㋌㋍㋎㋏\n㋐㋑㋒㋓㋔㋕㋖㋗㋘㋙㋚㋛㋜㋝㋞㋟\n㋠㋡㋢㋣㋤㋥㋦㋧㋨㋩㋪㋫㋬㋭㋮㋯\n㋰㋱㋲㋳㋴㋵㋶㋷㋸㋹㋺㋻㋼㋽㋾");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckEnclosedAlphanumerics","26","676","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("38");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckNumberForms","286","676","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("39");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckEnclosedCJKLettersMonths","531","676","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("40");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth00_01","765","486","240","40",null,null,null,null,null,null,this);
            obj.set_taborder("41");
            obj.set_text("Fullwidth(U+FF01 - U+FF60; U+FFE0 - U+FFEE) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taFullwidth","770","522","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("42");
            obj.set_value("！＂＃＄％＆＇（）＊＋，－．／\n０１２３４５６７８９：；＜＝＞？\n＠ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯ\nＰＱＲＳＴＵＶＷＸＹＺ［＼］＾＿\n｀ａｂｃｄｅｆｇｈｉｊｋｌｍｎｏ\nｐｑｒｓｔｕｖｗｘｙｚ｛｜｝～｟\n｠");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckFullwidth","770","676","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("43");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Static("lbHalfwidth00_00_00","1005","486","245","40",null,null,null,null,null,null,this);
            obj.set_taborder("44");
            obj.set_text("Arrow(U+2190 - U+21FF) :");
            obj.set_wordWrap("english");
            this.addChild(obj.name, obj);

            obj = new TextArea("taArrow","1010","522","225","154",null,null,null,null,null,null,this);
            obj.set_autoselect("true");
            obj.set_readonly("true");
            obj.set_taborder("45");
            obj.set_value("←↑→↓↔↕↖↗↘↙↚↛↜↝↞↟\n↠↡↢↣↤↥↦↧↨↩↪↫↬↭↮↯\n↰↱↲↳↴↵↶↷↸↹↺↻↼↽↾↿\n⇀⇁⇂⇃⇄⇅⇆⇇⇈⇉⇊⇋⇌⇍⇎⇏\n⇐⇑⇒⇓⇔⇕⇖⇗⇘⇙⇚⇛⇜⇝⇞⇟\n⇠⇡⇢⇣⇤⇥⇦⇧⇨⇩⇪⇫⇬⇭⇮⇯\n⇰⇱⇲⇳⇴⇵⇶⇷⇸⇹⇺⇻⇼⇽⇾⇿");
            this.addChild(obj.name, obj);

            obj = new Button("btnCheckArrow","1010","676","120","50",null,null,null,null,null,null,this);
            obj.set_taborder("46");
            obj.set_text("Check");
            this.addChild(obj.name, obj);

            obj = new Edit("Edit01","1090","80","156","50",null,null,null,null,null,null,this);
            obj.set_taborder("47");
            obj.set_value("①②③▼■×");
            obj.set_text("①②③▼■×");
            this.addChild(obj.name, obj);

            // Layout Functions
            //-- Default Layout : this
            obj = new Layout("default","",1280,720,this,function(p){});
            this.addLayout(obj.name, obj);
            
            // BindItem Information

            
            // TriggerItem Information

        };
        
        this.loadPreloadList = function()
        {

        };
        
        // User Script
        this.registerScript("RP_102433.xfdl", function() {
        this.compareInputtype = function(comp1, type) {
        	var comp2 = "";
        	comp2 = this.taCheckFull.value;
        	if(comp1 == comp2) {
        		this.lbResultFull.set_text("Same(" + type + ")");
        		this.lbResultFull.set_color("blue");
        	} else {
        		comp2 = comp2.replaceAll("\n", "");
        		if(comp2.length > 1) {
        			this.lbResultFull.set_text("Partial Match(" + type + ")");
        			this.lbResultFull.set_color("green");
        		} else {
        			this.lbResultFull.set_text("Different(" + type + ")");
        			this.lbResultFull.set_color("");
        		}
        	}
        	comp2 = this.taCheckEnglishNumberSymbol.value;
        	if(comp1 == comp2) {
        		this.lbResultEnglishDigit.set_text("Same(" + type + ")");
        		this.lbResultEnglishDigit.set_color("blue");
        	} else {
        		comp2 = comp2.replaceAll("\n", "");
        		if(comp2.length > 1) {
        			this.lbResultEnglishDigit.set_text("Partial Match(" + type + ")");
        			this.lbResultEnglishDigit.set_color("green");
        		} else {
        			this.lbResultEnglishDigit.set_text("Different(" + type + ")");
        			this.lbResultEnglishDigit.set_color("");
        		}
        	}
        	comp2 = this.taCheckHalf.value;
        	if(comp1 == comp2) {
        		this.lbResultHalfDigitSpace.set_text("Same(" + type + ")");
        		this.lbResultHalfDigitSpace.set_color("blue");
        	} else {
        		comp2 = comp2.replaceAll("\n", "");
        		if(comp2.length > 1) {
        			this.lbResultHalfDigitSpace.set_text("Partial Match(" + type + ")");
        			this.lbResultHalfDigitSpace.set_color("green");
        		} else {
        			this.lbResultHalfDigitSpace.set_text("Different(" + type + ")");
        			this.lbResultHalfDigitSpace.set_color("");
        		}
        	}
        	comp2 = this.taCheckAlpha.value;
        	if(comp1 == comp2) {
        		this.lbResultAlpha.set_text("Same(" + type + ")");
        		this.lbResultAlpha.set_color("blue");
        	} else {
        		comp2 = comp2.replaceAll("\n", "");
        		if(comp2.length > 1) {
        			this.lbResultAlpha.set_text("Partial Match(" + type + ")");
        			this.lbResultAlpha.set_color("green");
        		} else {
        			this.lbResultAlpha.set_text("Different(" + type + ")");
        			this.lbResultAlpha.set_color("");
        		}
        	}
        }
        this.btnCheck1Byte_onclick = function(obj,e)
        {
        	var comp1 = this.ta1Byte.value;
        	this.compareInputtype(comp1, "1Byte");
        };

        this.btnCheck2Byte_onclick = function(obj,e)
        {
        	var comp1 = this.ta2Byte.value;
        	this.compareInputtype(comp1, "2Byte");
        };

        this.btnCheckHalfwidth_onclick = function(obj,e)
        {
        	var comp1 = this.taHalfwidth.value;
        	this.compareInputtype(comp1, "Halfwidth");
        };

        this.btnClear_onclick = function(obj,e)
        {
        	this.taCheckFull.set_value("");
        	this.taCheckEnglishNumberSymbol.set_value("");
        	this.taCheckHalf.set_value("");
        	this.taCheckAlpha.set_value("");
        	this.lbResultFull.set_text("");
        	this.lbResultFull.set_color("");
        	this.lbResultEnglishDigit.set_text("");
        	this.lbResultEnglishDigit.set_color("");
        	this.lbResultHalfDigitSpace.set_text("");
        	this.lbResultHalfDigitSpace.set_color("");
        	this.lbResultAlpha.set_text("");
        	this.lbResultAlpha.set_color("");
        };

        this.taComp1OnSetfocus = function(obj,e)
        {
        	this.ta1Byte.set_border("");
        	this.ta2Byte.set_border("");
        	this.taHalfwidth.set_border("");
        	this.taHiragana.set_border("");
        	this.taKatakana.set_border("");
        	this.taEnclosedAlphanumerics.set_border("");
        	this.taNumberForms.set_border("");
        	this.taEnclosedCJKLettersMonths.set_border("");
        	this.taFullwidth.set_border("");
        	this.taArrow.set_border("");
        	obj.set_border("2px solid blue");
        };

        this.btnCheckHiragana_onclick = function(obj,e)
        {
        	var comp1 = this.taHiragana.value;
        	this.compareInputtype(comp1, "HIRAGANA");
        };

        this.btnCheckKatakana_onclick = function(obj,e)
        {
        	var comp1 = this.taKatakana.value;
        	this.compareInputtype(comp1, "KATAKANA");
        };

        this.btnCheckEnclosedAlphanumerics_onclick = function(obj,e)
        {
        	var comp1 = this.taEnclosedAlphanumerics.value;
        	this.compareInputtype(comp1, "EnclosedAlphanumerics");
        };

        this.btnCheckNumberForms_onclick = function(obj,e)
        {
        	var comp1 = this.taNumberForms.value;
        	this.compareInputtype(comp1, "NumberForms");
        };

        this.btnCheckEnclosedCJKLettersMonths_onclick = function(obj,e)
        {
        	var comp1 = this.taEnclosedCJKLettersMonths.value;
        	this.compareInputtype(comp1, "EnclosedCJKLettersMonths");
        };

        this.btnCheckFullwidth_onclick = function(obj,e)
        {
        	var comp1 = this.taFullwidth.value;
        	this.compareInputtype(comp1, "Fullwidth");
        };

        this.btnCheckArrow_onclick = function(obj,e)
        {
        	var comp1 = this.taArrow.value;
        	this.compareInputtype(comp1, "Arrow");
        };

        });
        
        // Regist UI Components Event
        this.on_initEvent = function()
        {
            this.ta1Byte.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.ta2Byte.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.taHalfwidth.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheck1Byte.addEventHandler("onclick",this.btnCheck1Byte_onclick,this);
            this.btnCheck2Byte.addEventHandler("onclick",this.btnCheck2Byte_onclick,this);
            this.btnCheckHalfwidth.addEventHandler("onclick",this.btnCheckHalfwidth_onclick,this);
            this.btnClear.addEventHandler("onclick",this.btnClear_onclick,this);
            this.taHiragana.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheckHiragana.addEventHandler("onclick",this.btnCheckHiragana_onclick,this);
            this.taKatakana.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheckKatakana.addEventHandler("onclick",this.btnCheckKatakana_onclick,this);
            this.taEnclosedAlphanumerics.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.taNumberForms.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.taEnclosedCJKLettersMonths.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheckEnclosedAlphanumerics.addEventHandler("onclick",this.btnCheckEnclosedAlphanumerics_onclick,this);
            this.btnCheckNumberForms.addEventHandler("onclick",this.btnCheckNumberForms_onclick,this);
            this.btnCheckEnclosedCJKLettersMonths.addEventHandler("onclick",this.btnCheckEnclosedCJKLettersMonths_onclick,this);
            this.taFullwidth.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheckFullwidth.addEventHandler("onclick",this.btnCheckFullwidth_onclick,this);
            this.taArrow.addEventHandler("onsetfocus",this.taComp1OnSetfocus,this);
            this.btnCheckArrow.addEventHandler("onclick",this.btnCheckArrow_onclick,this);
        };

        this.loadIncludeScript("RP_102433.xfdl");
        this.loadPreloadList();
        
        // Remove Reference
        obj = null;
    };
}
)();
