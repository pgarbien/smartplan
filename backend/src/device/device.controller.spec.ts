import { DeviceController } from "./device.controller"
import { Test, TestingModule } from '@nestjs/testing';

describe('NewDevice Controller', () => {
    let controller: DeviceController;
    
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          controllers: [DeviceController],
        }).compile();
    
        controller = module.get<DeviceController>(DeviceController);
      });
    
      it('should be defined', () => {
        expect(controller).toBeDefined();
      });
});
