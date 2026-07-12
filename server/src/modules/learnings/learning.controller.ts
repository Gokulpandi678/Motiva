import { asyncHandler } from '../../common/utils/asyncHandler';
import { sendSuccess } from '../../common/utils/apiResponse';
import { learningService } from './learning.service';
import { learningTopicService } from './learning-topic.service';
import { learningDomainService } from './learning-domain.service';
import type {
  CreateLearningInput,
  ListLearningsQuery,
  LowConfidenceQuery,
  RenameDomainInput,
  SearchDomainsQuery,
  TopicsQuery,
  UpdateLearningInput,
} from './learning.validation';

export const createLearning = asyncHandler(async (req, res) => {
  const learning = await learningService.createLearning(req.user!.id, req.body as CreateLearningInput);
  sendSuccess(res, learning, 201);
});

export const listLearnings = asyncHandler(async (req, res) => {
  const { learnings, meta } = await learningService.listLearnings(
    req.user!.id,
    req.query as unknown as ListLearningsQuery,
  );
  sendSuccess(res, learnings, 200, meta);
});

export const listLowConfidenceLearnings = asyncHandler(async (req, res) => {
  const { learnings, meta } = await learningService.listLowConfidence(
    req.user!.id,
    req.query as unknown as LowConfidenceQuery,
  );
  sendSuccess(res, learnings, 200, meta);
});

export const getLearning = asyncHandler(async (req, res) => {
  const learning = await learningService.getLearningById(req.user!.id, req.params.id as string);
  sendSuccess(res, learning);
});

export const updateLearning = asyncHandler(async (req, res) => {
  const learning = await learningService.updateLearning(
    req.user!.id,
    req.params.id as string,
    req.body as UpdateLearningInput,
  );
  sendSuccess(res, learning);
});

export const deleteLearning = asyncHandler(async (req, res) => {
  await learningService.deleteLearning(req.user!.id, req.params.id as string);
  res.status(204).send();
});

export const listTopics = asyncHandler(async (req, res) => {
  const { domain } = req.query as unknown as TopicsQuery;
  const topics = await learningTopicService.listTopics(req.user!.id, domain);
  sendSuccess(res, topics);
});

export const getTopicTimeline = asyncHandler(async (req, res) => {
  const timeline = await learningTopicService.getTopicTimeline(req.user!.id, req.params.tag as string);
  sendSuccess(res, timeline);
});

export const listDomains = asyncHandler(async (req, res) => {
  const { q, limit } = req.query as unknown as SearchDomainsQuery;
  const domains = await learningDomainService.listDomains(req.user!.id, q, limit);
  sendSuccess(res, domains);
});

export const renameDomain = asyncHandler(async (req, res) => {
  const { from, to } = req.body as RenameDomainInput;
  const result = await learningDomainService.renameDomain(req.user!.id, from, to);
  sendSuccess(res, result);
});
