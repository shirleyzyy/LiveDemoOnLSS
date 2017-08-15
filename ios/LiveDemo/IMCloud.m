//
//  IMCloud.m
//  LiveDemo
//
//  Created by zhaoyuanyuan on 2017/8/9.
//  Copyright © 2017年 zhaoyuanyuan. All rights reserved.
//

#import "IMCloud.h"
#import <RongIMLib/RongIMLib.h>
#import <CommonCrypto/CommonDigest.h>
@interface IMCloud()<RCIMClientReceiveMessageDelegate>
@property (nonatomic,strong) RCUserInfo *loginUser;
@end
@implementation IMCloud

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents
{
    return @[@"EventReminder"];
}

//代理方法,向JS发通知
- (void)onReceived:(RCMessage *)message left:(int)nLeft object:(id)object{
    NSLog(@"进入onReceived %@ :%@",message.senderUserId,((RCTextMessage*)message.content).content);
    [self sendEventWithName:@"EventReminder"
                       body:@{@"userId": message.senderUserId,
                              @"message":((RCTextMessage*)message.content).content
                                                    }];
}


RCT_EXPORT_METHOD(startRongYunIM){
    NSString *appSecrect = @"B2dMr4dAc1a";
    NSString *appKey = @"mgb7ka1nmfxjg";
    //先初始化
    [[RCIMClient sharedRCIMClient] initWithAppKey:appKey];
    // listen receive message
    [[RCIMClient sharedRCIMClient] setReceiveMessageDelegate:self object:nil];
    //    [[RCIMClient sharedRCIMClient] setRCConnectionStatusChangeDelegate:self];
    
    
    NSURL *url = [[NSURL alloc] initWithString:@"http://api.cn.ronghub.com/user/getToken.json"];
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
    request.HTTPMethod = @"POST";
    self.loginUser.name = @"Jack";
    NSArray *userId = @[@"001",@"002",@"003",@"004",@"005",@"006"];
    int a = arc4random() % 6;
    NSString *randomUserId = [NSString stringWithFormat:@"userId=%@",userId[a]];

    //表单形式访问
    NSData *ttt = [randomUserId dataUsingEncoding:NSUTF8StringEncoding];
    
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
            } error:^(RCConnectErrorCode status) {
                NSLog(@"登陆融云失败，失败");
            } tokenIncorrect:^{
                NSLog(@"token错误，登陆失败");
            }];
        }
    }];
    [dataTask resume];
}

RCT_EXPORT_METHOD(sendRCMessage:(NSString *)text){
    NSLog(@"用户输入了：%@",text);
    dispatch_async(dispatch_get_main_queue(), ^{
        [self sendMessage:text];
    });
}

- (void)sendMessage:(NSString *)text{
    RCTextMessage *test = [RCTextMessage messageWithContent:text];
    test.senderUserInfo = [[RCIMClient sharedRCIMClient] currentUserInfo];
    [[RCIMClient sharedRCIMClient] sendMessage:ConversationType_GROUP targetId:@"001" content:test pushContent:nil pushData:nil success:^(long messageId) {
        NSLog(@"发送消息成功");
    } error:^(RCErrorCode nErrorCode, long messageId) {
        NSLog(@"发送消息失败");
    }];
}


@end
