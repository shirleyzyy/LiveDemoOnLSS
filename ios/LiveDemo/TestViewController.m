//
//  TestViewController.m
//  VideoPlayer
//
//  Created by zhaoyuanyuan on 2017/7/31.
//  Copyright © 2017年 baidu. All rights reserved.
//

#import "TestViewController.h"
#import <RongIMLib/RongIMLib.h>
#import <CommonCrypto/CommonDigest.h>
@interface TestViewController ()<RCIMClientReceiveMessageDelegate>
@property (nonatomic,strong) RCUserInfo *loginUser;
@end

@implementation TestViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    // Do any additional setup after loading the view.
    self.view.backgroundColor = [UIColor yellowColor];
    self.viewModel = [[PlayerViewModel alloc] initWithURL:@"http://hf8rads3r2zq4z8yuwm.exp.bcelive.com/lss-hf8rat3avr7vwekq/live.m3u8"
                                                                title:@"haha"
                                                         downloadable:NO];
    [self.viewModel layout:self.view];
    [self.viewModel start];
//    [self startRongYunIM];
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

//代理方法
- (void)onReceived:(RCMessage *)message left:(int)nLeft object:(id)object{
    NSLog(@"进入onReceived");
}


- (void)startRongYunIM{
    NSString *appSecrect = @"n6MZ6PNE70";
    NSString *appKey = @"c9kqb3rdcx0aj";
    //先初始化
    [[RCIMClient sharedRCIMClient] initWithAppKey:appKey];
    // listen receive message
    [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
//    [[RCIMClient sharedRCIMClient] setRCConnectionStatusChangeDelegate:self];
    
    
    NSURL *url = [[NSURL alloc] initWithString:@"http://api.cn.ronghub.com/user/getToken.json"];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    request.HTTPMethod = @"POST";
    self.loginUser.name = @"Jack";
    //表单形式访问
    NSData *ttt = [@"userId=123&name=Jack" dataUsingEncoding:NSUTF8StringEncoding];
    
    request.HTTPBody = ttt;
    
    NSString *nonce = [NSString stringWithFormat:@"%d", rand()];
    
    long timestamp = (long)[[NSDate date] timeIntervalSince1970];
    
    NSString *unionString = [NSString stringWithFormat:@"%@%@%ld", appSecrect, nonce, timestamp];
    const char *cstr = [unionString cStringUsingEncoding:NSUTF8StringEncoding];
    NSData *data = [NSData dataWithBytes:cstr length:unionString.length];
    uint8_t digest[CC_SHA1_DIGEST_LENGTH];
    
    CC_SHA1(data.bytes, (unsigned int)data.length, digest);
    
    NSMutableString* output = [NSMutableString stringWithCapacity:CC_SHA1_DIGEST_LENGTH * 2];
    
    for(int i = 0; i < CC_SHA1_DIGEST_LENGTH; i++) {
        [output appendFormat:@"%02x", digest[i]];
    }
    
    
    NSString *timestampStr = [NSString stringWithFormat:@"%ld", timestamp];
    [request setValue:appKey forHTTPHeaderField:@"App-Key"];
    [request setValue:nonce forHTTPHeaderField:@"Nonce"];
    [request setValue:timestampStr forHTTPHeaderField:@"Timestamp"];
    [request setValue:output forHTTPHeaderField:@"Signature"];
    [request setValue:@"application/x-www-form-urlencoded" forHTTPHeaderField:@"Content-Type"];
    NSURLSession *session = [NSURLSession sharedSession];
    NSURLSessionTask *dataTask = [session dataTaskWithRequest:request completionHandler:^(NSData * _Nullable data, NSURLResponse * _Nullable response, NSError * _Nullable error) {
        NSDictionary *respondData = [NSJSONSerialization JSONObjectWithData:data options:kNilOptions error:nil];
        NSLog(@"%@", respondData);
        NSString *token = @"";
        NSLog(@"code %@",[respondData objectForKey:@"code"]);
        if ([[respondData objectForKey:@"code"] intValue] == 200) {
            //成功获取到token
            token = [respondData objectForKey:@"token"];
            [[RCIMClient sharedRCIMClient] connectWithToken:token success:^(NSString *userId) {
                NSLog(@"成功登陆融云，id为%@",userId);
                RCUserInfo *user = [[RCUserInfo alloc]init];
                user.userId = userId;
                user.portraitUri = @"";
                user.name = @"Jack";
                [RCIMClient sharedRCIMClient].currentUserInfo = user;
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self sendMessage];
                });
            } error:^(RCConnectErrorCode status) {
                NSLog(@"登陆融云失败，失败");
            } tokenIncorrect:^{
                NSLog(@"token错误，登陆失败");
            }];
        }
    }];
    [dataTask resume];
}

- (void)sendMessage{
    RCTextMessage *test = [RCTextMessage messageWithContent:@"哈哈哈哈"];
    test.senderUserInfo = [[RCIMClient sharedRCIMClient] currentUserInfo];
    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_GROUP targetId:@"12345" content:test pushContent:nil pushData:nil success:^(long messageId) {
        NSLog(@"发送消息成功");
    } error:^(RCErrorCode nErrorCode, long messageId) {
        NSLog(@"发送消息失败");
    }];
}

/*
#pragma mark - Navigation

// In a storyboard-based application, you will often want to do a little preparation before navigation
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    // Get the new view controller using [segue destinationViewController].
    // Pass the selected object to the new view controller.
}
*/

@end
